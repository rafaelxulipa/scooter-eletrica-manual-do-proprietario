// Gera tudo que o site usa a partir dos PDFs originais em /source:
//  1. PDFs com marca d'agua  -> public/pdf/
//  2. Imagens das paginas (renderizadas JA com a marca d'agua) -> public/pages/
//  3. Fotos e ilustracoes extraidas do PDF -> public/img/
// Requer poppler-utils (pdftoppm, pdfimages) instalado.
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import os from 'node:os'
import sharp from 'sharp'

// ----- CONFIG: edite aqui -----
const WATERMARK = process.env.WATERMARK || 'DEMONSTRAÇÃO'
const SUBTITLE = process.env.WATERMARK_SUB || 'Material de apresentação'
const MODELS = [
  { id: 'rosa', src: 'source/rosa.pdf' },
  { id: 'verde', src: 'source/verde.pdf' },
]
// -------------------------------

const out = (p) => { mkdirSync(p, { recursive: true }); return p }
const pdfDir = out('public/pdf'), pagesDir = out('public/pages'), imgDir = out('public/img')
const quiet = { stdio: 'ignore' } // poppler emite avisos inofensivos de fontes Type 3
const tmp = join(os.tmpdir(), 'cappuccino-assets-' + process.pid)
out(tmp)

async function watermark(src, dest) {
  const doc = await PDFDocument.load(readFileSync(src))
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const reg = await doc.embedFont(StandardFonts.Helvetica)
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    // Texto diagonal repetido em grade (dificil de remover sem estragar a pagina)
    const size = 34, stepX = 300, stepY = 150
    for (let y = -height; y < height * 2; y += stepY) {
      for (let x = -width; x < width * 2; x += stepX) {
        const off = (Math.round(y / stepY) % 2) * (stepX / 2)
        page.drawText(WATERMARK, {
          x: x + off, y, size, font: bold,
          color: rgb(0.45, 0.45, 0.5), opacity: 0.16, rotate: degrees(30),
        })
      }
    }
    // Faixa grande central
    const big = 78, w = bold.widthOfTextAtSize(WATERMARK, big)
    page.drawText(WATERMARK, {
      x: width / 2 - (w / 2) * Math.cos(Math.PI / 6) , y: height / 2 - (w / 2) * Math.sin(Math.PI / 6) - 20,
      size: big, font: bold, color: rgb(0.9, 0.2, 0.4), opacity: 0.13, rotate: degrees(30),
    })
    const foot = `${WATERMARK}  |  ${SUBTITLE}`
    page.drawText(foot, {
      x: width / 2 - reg.widthOfTextAtSize(foot, 8) / 2, y: 8, size: 8, font: reg,
      color: rgb(0.35, 0.35, 0.4), opacity: 0.8,
    })
  }
  doc.setTitle('Manual do Proprietário Cappuccino (demonstração)')
  doc.setProducer('Demonstração')
  writeFileSync(dest, await doc.save())
}

for (const m of MODELS) {
  const wm = join(pdfDir, `manual-cappuccino-${m.id}-demo.pdf`)
  await watermark(m.src, wm)
  console.log('PDF  ', wm)

  // Paginas -> imagens (a partir do PDF ja marcado)
  execFileSync('pdftoppm', ['-r', '170', '-png', wm, join(tmp, `pg-${m.id}`)], quiet)
  for (const f of readdirSync(tmp).filter((f) => f.startsWith(`pg-${m.id}`))) {
    const n = f.match(/-(\d+)\.png$/)[1].replace(/^0+/, '')
    await sharp(join(tmp, f)).webp({ quality: 82 }).toFile(join(pagesDir, `${m.id}-${n}.webp`))
  }

  // Foto da capa
  execFileSync('pdfimages', ['-png', '-f', '1', '-l', '1', m.src, join(tmp, `cover-${m.id}`)], quiet)
  await sharp(join(tmp, `cover-${m.id}-000.png`)).resize({ width: 1100 }).webp({ quality: 86 }).toFile(join(imgDir, `scooter-${m.id}.webp`))
}

// Ilustracoes (iguais nos dois manuais)
execFileSync('pdfimages', ['-png', '-f', '2', '-l', '3', MODELS[0].src, join(tmp, 'ill')], quiet)
await sharp(join(tmp, 'ill-001.png')).webp({ quality: 90 }).toFile(join(imgDir, 'painel.webp'))
await sharp(join(tmp, 'ill-003.png')).webp({ quality: 90 }).toFile(join(imgDir, 'diagrama.webp'))

// Favicons (icone de raio sobre fundo escuro, com a cor de destaque do modelo rosa)
const icon = (bg, fg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${bg}"/><path d="M36 8 16 36h14l-4 20 22-30H34z" fill="${fg}"/></svg>`
const svg = icon('#1f1f27', '#f4a3bd')
writeFileSync('public/favicon.svg', svg)
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toFile(join('public', name))
}
writeFileSync('public/site.webmanifest', JSON.stringify({
  name: 'Manual do Proprietário Cappuccino', short_name: 'Cappuccino',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  theme_color: '#1f1f27', background_color: '#1f1f27', display: 'standalone',
}, null, 2))

// Imagem de pre-visualizacao para WhatsApp, redes sociais e buscadores (1200x630)
{
  const W = 1200, H = 630
  const photo = await sharp(join(imgDir, 'scooter-verde.webp')).resize({ height: H - 30 }).png().toBuffer()
  // cor de fundo do painel = cor do canto da foto, para nao aparecer retangulo
  const { data: px } = await sharp(photo).raw().toBuffer({ resolveWithObject: true })
  const panelBg = `rgb(${px[0]},${px[1]},${px[2]})`
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="70" y="190" fill="#a8d8c5" font-family="Poppins, Helvetica, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="5">MANUAL DO PROPRIETÁRIO</text>
    <text x="64" y="320" fill="#ffffff" font-family="Poppins, Helvetica, Arial, sans-serif" font-size="124" font-weight="800">MOTO</text>
    <text x="64" y="436" fill="#a8d8c5" font-family="Poppins, Helvetica, Arial, sans-serif" font-size="124" font-weight="800">ELÉTRICA</text>
    <rect x="70" y="470" width="110" height="6" rx="3" fill="#a8d8c5"/>
    <text x="70" y="540" fill="#c9c9d3" font-family="Poppins, Helvetica, Arial, sans-serif" font-size="30" font-weight="500">Cappuccino  |  1000 W  |  32 km/h</text>
  </svg>`)
  await sharp({ create: { width: W, height: H, channels: 3, background: '#1f1f27' } })
    .composite([
      { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="${H}"><rect width="520" height="${H}" fill="${panelBg}"/></svg>`), left: W - 520, top: 0 },
      { input: photo, left: W - 520 + Math.round((520 - (await sharp(photo).metadata()).width) / 2), top: 15 },
      { input: text, left: 0, top: 0 },
    ])
    .jpeg({ quality: 82 }).toFile('public/og-image.jpg')
}

rmSync(tmp, { recursive: true, force: true })
console.log('Assets gerados.')
