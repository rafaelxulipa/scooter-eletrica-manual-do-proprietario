# Cappuccino | Manual do Proprietário (site de demonstração)

Landing page moderna e interativa para o manual da moto elétrica **Cappuccino**, feita para apresentar a clientes como demonstração de trabalho. Os dois manuais em PDF (modelos **rosa** e **verde-água**) viram um site com animações, um manual que se folheia como revista e download dos PDFs com marca d'água.

## O que o site tem

| Seção | O que faz |
| --- | --- |
| Hero | Título animado, foto da moto com parallax, chips flutuantes e troca de modelo (rosa/verde-água) que muda as cores do site inteiro |
| Faixa animada | Marquee com os destaques técnicos |
| Especificações | Cards com números que contam até o valor, efeito 3D ao passar o mouse, painel LED com legenda interativa |
| Partes da moto | Ilustração com 9 pontos clicáveis ligados a uma lista |
| Segurança | Acordeão com as regras do manual e um checklist "Verifique antes de pilotar" com anel de progresso |
| Manual interativo | Flipbook com efeito de virar página, setas, teclado (← →), indicadores e tela cheia |
| Download | PDF de cada modelo, com marca d'água |

Extras: barra de progresso de rolagem, brilho que acompanha o cursor, menu com desfoque, favicons, layout responsivo (celular, tablet, desktop) e respeito a `prefers-reduced-motion`.

## Stack

- **React 18** + **Vite** (build estático, ideal para a Vercel)
- **framer-motion** para animações e efeitos de rolagem
- **react-pageflip** (StPageFlip) para o efeito de revista
- **lucide-react** para ícones
- **pdf-lib** + **sharp** + **poppler** no script que gera os assets

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera a pasta dist/
npm run preview    # testa o build localmente
```

## Estrutura

```
source/                 PDFs ORIGINAIS (sem marca d'água). Ignorado pelo git.
  rosa.pdf  verde.pdf
scripts/build-assets.mjs  Gera PDFs com marca d'água, imagens das páginas, fotos e favicons
public/
  pdf/                  PDFs com marca d'água (os únicos que vão ao ar)
  pages/                Páginas do manual em imagem (já com marca d'água) para o flipbook
  img/                  Foto da moto, painel e ilustração das partes
  favicon.svg, *.png, site.webmanifest
src/
  data.js               TODO o conteúdo (textos, specs, partes, segurança, modelos)
  App.jsx               Seções e componentes
  styles.css            Estilos e variáveis de cor
```

## Marca d'água

Os PDFs publicados recebem texto diagonal repetido, uma faixa grande central e um rodapé. As imagens do flipbook são renderizadas **a partir do PDF já marcado**, então a marca também aparece no manual folheável.

Para mudar o texto e regenerar (requer `pdftoppm` e `pdfimages`, do pacote `poppler-utils`):

```bash
WATERMARK="DEMONSTRAÇÃO" WATERMARK_SUB="Proposta para NOME DO CLIENTE" npm run assets
```

Importante: os PDFs originais ficam só em `source/`, que está no `.gitignore`. Nunca coloque os originais em `public/`, senão qualquer pessoa consegue baixar sem a marca. Se o repositório for público, confirme que `source/` continua ignorado. Os `public/*` gerados são commitados, então a Vercel não precisa do poppler.

## Como editar o conteúdo

- **Textos, números, partes e checklist:** `src/data.js`
- **Posição dos pontos na ilustração:** campos `x` e `y` (em %) de `PARTS` em `src/data.js`
- **Modelo exibido ao abrir o site:** constante `DEFAULT_MODEL` no topo de `src/App.jsx` (hoje `'verde'`; use `'rosa'` para inverter)
- **Cores dos modelos:** `accent`, `strong` e `tint` em `MODELS`
- **Novo modelo/cor:** adicione o PDF em `source/`, inclua em `MODELS` em `scripts/build-assets.mjs` e em `src/data.js`, e rode `npm run assets`
- **Versão final para o cliente:** rode `npm run assets` com o texto de marca d'água desejado, ou gere sem ela ajustando `watermark()` no script

## Deploy na Vercel

1. Suba o projeto para um repositório no GitHub (sem `source/`).
2. Na Vercel: **Add New > Project**, importe o repositório.
3. Preset **Vite** é detectado sozinho (Build: `npm run build`, Output: `dist`). Deploy.

Ou pela CLI: `npx vercel` na raiz do projeto.

## Observações sobre o conteúdo

- Os dois PDFs têm o mesmo texto. A única diferença é a cor da moto e o item 6 das partes: **baú traseiro** (rosa) ou **encosto traseiro** (verde-água). O site troca isso automaticamente.
- No manual original, os itens "Método seguro de uso e avisos do carregador" e "Precauções para lavagem" têm pouco ou nenhum texto. O site reproduz apenas o que existe no PDF.
