import { forwardRef, useEffect, useMemo, useRef, useState, createContext, useContext } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, animate } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'
import {
  Download, BookOpen, Zap, ChevronLeft, ChevronRight, Maximize2, Minimize2, ShieldCheck,
  Route, ParkingCircle, PlugZap, Wrench, Check, ArrowDown, Gauge, Battery, Timer, Weight, Mountain, Ruler,
} from 'lucide-react'
import { MODELS, STATS, SPECS, PANEL, PARTS, SAFETY, CHECKLIST } from './data.js'

// Modelo exibido ao abrir o site: 'verde' ou 'rosa'
const DEFAULT_MODEL = 'verde'
const ModelCtx = createContext(MODELS[DEFAULT_MODEL])
const useModel = () => useContext(ModelCtx)
const ICONS = { road: Route, park: ParkingCircle, plug: PlugZap, wrench: Wrench }

/* ---------- utilitarios de animacao ---------- */
const Reveal = ({ children, delay = 0, y = 40, className = '', as = 'div' }) => {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  )
}

function CountUp({ to, prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const v = useMotionValue(0)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(v, to, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setN(Math.round(x)) })
    return () => c.stop()
  }, [inView, to, v])
  return <span ref={ref}>{prefix}{n}</span>
}

function Tilt({ children, className = '' }) {
  const ref = useRef(null)
  const rx = useSpring(0, { stiffness: 200, damping: 20 })
  const ry = useSpring(0, { stiffness: 200, damping: 20 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  const leave = () => { rx.set(0); ry.set(0) }
  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}>
      {children}
    </motion.div>
  )
}

/* ---------- barra de progresso e brilho do cursor ---------- */
function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="progress" style={{ scaleX: sx }} />
}

function CursorGlow() {
  useEffect(() => {
    const el = document.documentElement
    const h = (e) => { el.style.setProperty('--mx', e.clientX + 'px'); el.style.setProperty('--my', e.clientY + 'px') }
    window.addEventListener('pointermove', h)
    return () => window.removeEventListener('pointermove', h)
  }, [])
  return <div className="cursor-glow" aria-hidden />
}

/* ---------- navegacao ---------- */
function ModelSwitch({ model, setModel }) {
  return (
    <div className="switch" role="group" aria-label="Escolher modelo">
      {Object.values(MODELS).map((m) => (
        <button key={m.id} onClick={() => setModel(m.id)} aria-pressed={model.id === m.id}>
          {model.id === m.id && <motion.span layoutId="pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <i style={{ background: m.accent }} /> <span>{m.name}</span>
        </button>
      ))}
    </div>
  )
}

function Nav({ model, setModel }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const h = () => setSolid(window.scrollY > 40)
    h(); window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <header className={'nav' + (solid ? ' solid' : '')}>
      <a className="brand" href="#topo"><span className="logo"><Zap size={16} /></span> Cappuccino</a>
      <nav className="links">
        <a href="#specs">Especificações</a><a href="#partes">Partes</a>
        <a href="#seguranca">Segurança</a><a href="#manual">Manual</a>
      </nav>
      <div className="nav-right">
        <ModelSwitch model={model} setModel={setModel} />
        <a className="btn small" href={model.pdf} download><Download size={15} /> <span>PDF</span></a>
      </div>
    </header>
  )
}

/* ---------- hero ---------- */
function Hero() {
  const model = useModel()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const rot = useTransform(scrollYProgress, [0, 1], [0, -4])
  const ty = useTransform(scrollYProgress, [0, 1], [0, -60])
  const chips = [[Gauge, '32 km/h'], [Battery, '48V 20Ah'], [Timer, '50-55 km']]
  return (
    <section id="topo" className="hero" ref={ref}>
      <motion.div className="hero-text" style={{ y: ty }}>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Manual do proprietário</motion.p>
        <h1>
          {['MOTO', 'ELÉTRICA'].map((w, i) => (
            <span className="mask" key={w}><motion.span style={i ? { color: 'var(--accent)' } : null}
              initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span></span>
          ))}
        </h1>
        <div className="bar" />
        <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Tudo sobre a <b>Cappuccino</b> em um só lugar: especificações, partes da moto, dicas de segurança e o manual completo para folhear ou baixar.
        </motion.p>
        <motion.div className="cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <a className="btn" href="#manual"><BookOpen size={18} /> Abrir o manual</a>
          <a className="btn ghost" href={model.pdf} download><Download size={18} /> Baixar PDF</a>
        </motion.div>
        <a href="#specs" className="scroll-hint" aria-label="Rolar para baixo"><ArrowDown size={18} /></a>
      </motion.div>

      <div className="hero-visual">
        <div className="blob" />
        <AnimatePresence mode="wait">
          <motion.img key={model.id} src={model.photo} alt={`Moto elétrica Cappuccino ${model.name}`} className="scooter"
            style={{ y, rotate: rot }}
            initial={{ opacity: 0, x: 80, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -80, scale: 0.94 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} />
        </AnimatePresence>
        {chips.map(([Icon, t], i) => (
          <motion.div key={t} className={'chip c' + i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.15, type: 'spring' }}>
            <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut' }}><Icon size={16} /> {t}</motion.span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Marquee() {
  const items = ['1000 W', '32 km/h', 'Lítio 48V 20Ah', 'Luzes completas', 'Painel LED', 'Até 150 kg', 'Controle remoto', '50-55 km por carga']
  return (
    <div className="marquee" aria-hidden>
      <div className="track">{[...items, ...items, ...items].map((t, i) => <span key={i}><Zap size={14} /> {t}</span>)}</div>
    </div>
  )
}

/* ---------- especificacoes ---------- */
const SPEC_ICONS = [Zap, Gauge, Weight, Battery, Route, Timer]
function Specs() {
  const [hover, setHover] = useState(null)
  return (
    <section id="specs" className="section">
      <Reveal><p className="kicker">Pág. 02</p><h2>Especificações <em>técnicas</em></h2></Reveal>
      <div className="stats">
        {STATS.map((s, i) => {
          const Icon = SPEC_ICONS[i]
          return (
            <Reveal key={s.label} delay={i * 0.07}>
              <Tilt className="stat">
                <Icon className="stat-icon" size={22} />
                <div className="num">{s.value !== undefined ? <CountUp to={s.value} prefix={s.prefix} /> : s.text}{s.unit && <small> {s.unit}</small>}</div>
                <div className="lbl">{s.label}</div>
              </Tilt>
            </Reveal>
          )
        })}
      </div>
      <div className="specs-grid">
        <Reveal className="spec-list">
          {SPECS.map(([k, v], i) => (
            <motion.div key={k} className="spec" whileHover={{ x: 6 }}>
              <span>{k}</span><b>{v}</b>
              {i === 1 && <Mountain size={16} />}{i === 2 && <Ruler size={16} />}
            </motion.div>
          ))}
        </Reveal>
        <Reveal delay={0.15} className="panel-card">
          <div className="panel-img"><img src="/img/painel.webp" alt="Painel LED digital" loading="lazy" /></div>
          <ol className="legend">
            {PANEL.map((p, i) => (
              <li key={p} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className={hover === i ? 'on' : ''}>
                <b>{i + 1}</b>{p}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- partes da moto (hotspots) ---------- */
function Parts() {
  const model = useModel()
  const [active, setActive] = useState(1)
  const parts = PARTS.map((p) => (p.name === 'REAR' ? { ...p, name: model.rear } : p))
  const cur = parts.find((p) => p.n === active)
  return (
    <section id="partes" className="section dark">
      <Reveal><p className="kicker">Pág. 03</p><h2>Conheça as <em>partes</em></h2>
        <p className="sub">Toque nos pontos da ilustração ou escolha um item da lista.</p></Reveal>
      <div className="parts">
        <Reveal className="diagram">
          <div className="diagram-box">
            <img src="/img/diagrama.webp" alt="Ilustração da moto com as partes numeradas" loading="lazy" />
            {parts.map((p) => (
              <button key={p.n} className={'hot' + (active === p.n ? ' on' : '')} style={{ left: p.x + '%', top: p.y + '%' }}
                onClick={() => setActive(p.n)} onMouseEnter={() => setActive(p.n)} aria-label={p.name}>
                {active === p.n && <span className="ping" />}{p.n}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={cur.n} className="callout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <b>{cur.n}</b> {cur.name}
            </motion.div>
          </AnimatePresence>
        </Reveal>
        <Reveal delay={0.1} className="parts-list">
          {parts.map((p) => (
            <button key={p.n} className={active === p.n ? 'on' : ''} onClick={() => setActive(p.n)}><b>{p.n}</b>{p.name}</button>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- seguranca ---------- */
function Ring({ pct }) {
  const r = 42, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 100 100" className="ring">
      <circle cx="50" cy="50" r={r} className="ring-bg" />
      <motion.circle cx="50" cy="50" r={r} className="ring-fg" strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - pct) }} transition={{ duration: 0.5 }} />
      <text x="50" y="56" textAnchor="middle">{Math.round(pct * 100)}%</text>
    </svg>
  )
}

function Safety() {
  const [open, setOpen] = useState(0)
  const [done, setDone] = useState([])
  const toggle = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
  const pct = done.length / CHECKLIST.length
  return (
    <section id="seguranca" className="section">
      <Reveal><p className="kicker">Pág. 04 e 05</p><h2>Dicas especiais de <em>segurança</em></h2></Reveal>
      <div className="safety">
        <div className="acc">
          {SAFETY.map((s, i) => {
            const Icon = ICONS[s.icon]; const isOpen = open === i
            return (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className={'acc-item' + (isOpen ? ' open' : '')}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span className="ic"><Icon size={20} /></span><span className="t">{s.title}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="plus">+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}>
                        {s.points.map((p) => <li key={p}>{p}</li>)}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
        <Reveal delay={0.1} className="check-card">
          <div className="check-head"><ShieldCheck size={22} /><div><h3>Verifique antes de pilotar</h3><p>Se houver alguma anormalidade, repare a tempo ou procure um profissional.</p></div></div>
          <div className="check-body">
            <Ring pct={pct} />
            <ul>
              {CHECKLIST.map((c, i) => (
                <li key={c}><button className={done.includes(i) ? 'on' : ''} onClick={() => toggle(i)}>
                  <span className="box">{done.includes(i) && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={14} /></motion.span>}</span>{c}
                </button></li>
              ))}
            </ul>
          </div>
          <AnimatePresence>{pct === 1 && <motion.p className="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Tudo certo! Boa viagem e use capacete.</motion.p>}</AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- manual folheavel ---------- */
const Page = forwardRef(({ src, n }, ref) => (
  <div ref={ref} className="page"><img src={src} alt={`Página ${n} do manual`} draggable={false} /></div>
))
Page.displayName = 'Page'

const unlockOrientation = () => { try { screen.orientation?.unlock?.() } catch { /* nao suportado */ } }

function Flipbook() {
  const model = useModel()
  const wrap = useRef(null), book = useRef(null), box = useRef(null)
  const [dim, setDim] = useState({ w: 600, spread: true })
  const [cur, setCur] = useState(0)
  const [full, setFull] = useState(false)
  const [reader, setReader] = useState(false) // modo leitura ampliada (celular)
  const total = model.pages.length
  // o livro remonta ao trocar modelo ou layout; volta para a capa e zera o contador
  useEffect(() => { setCur(0) }, [model.id, dim.w, dim.spread])

  useEffect(() => {
    // Uma pagina por vez. A largura tambem e limitada pela altura da janela, para a pagina inteira caber na tela.
    const fit = (cw) => {
      const spread = false // uma pagina por vez (efeito de virar original)
      const byH = Math.floor((window.innerHeight - (full ? 90 : 230)) * 841.92 / 594.96)
      const w = Math.min(Math.floor(cw), byH, 1100)
      setDim({ w: Math.max(280, w), spread })
    }
    if (!wrap.current) return
    const ro = new ResizeObserver(([e]) => fit(e.contentRect.width))
    ro.observe(wrap.current)
    const onResize = () => wrap.current && fit(wrap.current.clientWidth)
    window.addEventListener('resize', onResize)
    return () => { ro.disconnect(); window.removeEventListener('resize', onResize) }
  }, [full, reader])
  useEffect(() => {
    // saiu da tela cheia nativa (ex.: tecla Esc)
    const h = () => { if (!document.fullscreenElement) { setFull(false); setReader(false); unlockOrientation() } }
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  useEffect(() => {
    // trava a rolagem do site enquanto o manual esta em tela cheia
    document.body.style.overflow = full ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [full])
  useEffect(() => {
    const k = (e) => {
      const r = box.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > innerHeight) return
      if (e.key === 'ArrowRight') book.current?.pageFlip().flipNext()
      if (e.key === 'ArrowLeft') book.current?.pageFlip().flipPrev()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const { w, spread } = dim
  const h = Math.round(w * 594.96 / 841.92)
  const go = (i) => book.current?.pageFlip().flip(i)
  const toggleFull = () => {
    if (full) {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
      unlockOrientation()
      setFull(false); setReader(false)
      return
    }
    setFull(true)
    // Celular (tela estreita): modo leitura ampliada. Desktop/tablet: overlay + tela cheia nativa quando existir.
    if (window.innerWidth < 700) { setReader(true); return }
    box.current?.requestFullscreen?.().catch(() => {})
    try { screen.orientation?.lock?.('landscape').catch(() => {}) } catch { /* nao suportado */ }
  }

  return (
    <section id="manual" className="section dark">
      <Reveal><p className="kicker">Manual interativo</p><h2>Folheie o <em>manual</em></h2>
        <p className="sub">Arraste as bordas da página, clique nas setas ou use as teclas ← →.</p></Reveal>
      <div className={'book-box' + (full ? ' full' : '')} ref={box}>
        {reader ? (
          <div className="reader">
            <div className="reader-bar">
              <span>Arraste e use zoom com os dedos</span>
              <a href={model.pdf} download aria-label="Baixar PDF"><Download size={18} /></a>
              <button onClick={toggleFull} aria-label="Fechar leitura"><Minimize2 size={18} /> Fechar</button>
            </div>
            <div className="reader-scroll">
              {model.pages.map((src, i) => <img key={src} src={src} alt={`Página ${i + 1} do manual`} />)}
            </div>
          </div>
        ) : (
          <>
        <div className="book-stage" ref={wrap}>
          <HTMLFlipBook key={model.id + w + spread} ref={book} width={w} height={h} size="fixed" usePortrait showCover={false}
            drawShadow maxShadowOpacity={0.5} flippingTime={800} mobileScrollSupport={false} onFlip={(e) => setCur(e.data)} className="flip" style={{}}>
            {model.pages.map((src, i) => <Page key={src} src={src} n={i + 1} />)}
          </HTMLFlipBook>
        </div>
        <div className="book-ctrl">
          <button onClick={() => book.current?.pageFlip().flipPrev()} aria-label="Página anterior" disabled={cur === 0}><ChevronLeft /></button>
          <div className="dots">{model.pages.map((_, i) => <button key={i} className={cur === i ? 'on' : ''} onClick={() => go(i)} aria-label={`Ir para página ${i + 1}`} />)}</div>
          <span className="count">{cur + 1} / {total}</span>
          <button onClick={() => book.current?.pageFlip().flipNext()} aria-label="Próxima página" disabled={cur === total - 1}><ChevronRight /></button>
          <button onClick={toggleFull} aria-label={full ? 'Sair da tela cheia' : 'Tela cheia'}>{full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </div>
          </>
        )}
        {!full && <button className="fs-cta" onClick={toggleFull}><Maximize2 size={16} /> Ampliar para ler</button>}
      </div>
    </section>
  )
}

/* ---------- download ---------- */
function Downloads() {
  return (
    <section id="download" className="section">
      <Reveal><p className="kicker">Download</p><h2>Leve o manual <em>com você</em></h2>
        <p className="sub">Escolha o PDF do seu modelo. Os arquivos desta versão de demonstração levam marca d'água.</p></Reveal>
      <div className="dl-grid">
        {Object.values(MODELS).map((m, i) => (
          <Reveal key={m.id} delay={i * 0.1}>
            <motion.a href={m.pdf} download className="dl" whileHover={{ y: -6 }} style={{ '--c': m.accent, '--s': m.strong, '--t': m.tint }}>
              <img src={m.pages[0]} alt="" loading="lazy" />
              <div><span>Cappuccino</span><h3>{m.name}</h3><p>PDF, 4 páginas, {m.rear.toLowerCase()}</p></div>
              <span className="dl-btn"><Download size={18} /> Baixar</span>
            </motion.a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function App() {
  const [id, setId] = useState(DEFAULT_MODEL)
  const model = MODELS[id] || MODELS[DEFAULT_MODEL]
  useEffect(() => {
    const s = document.documentElement.style
    s.setProperty('--accent', model.accent); s.setProperty('--strong', model.strong); s.setProperty('--tint', model.tint)
  }, [model])
  const value = useMemo(() => model, [model])
  return (
    <ModelCtx.Provider value={value}>
      <ScrollBar /><CursorGlow />
      <Nav model={model} setModel={setId} />
      <main>
        <Hero /><Marquee /><Specs /><Parts /><Safety /><Flipbook /><Downloads />
      </main>
      <footer className="footer">
        <span className="brand"><span className="logo"><Zap size={14} /></span> Cappuccino</span>
        <p>Manual do Proprietário, versão de demonstração.</p>
        <p className="credit">Desenvolvido por <a href="https://orlamsolutions.or.app.br/" target="_blank" rel="noopener noreferrer">Orlam Solutions</a></p>
      </footer>
    </ModelCtx.Provider>
  )
}
