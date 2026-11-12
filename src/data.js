// Todo o conteudo do manual fica aqui, separado da interface.
export const MODELS = {
  rosa: {
    id: 'rosa', name: 'Rosa', accent: '#f4a3bd', strong: '#e8638f', tint: '#fde8ef',
    photo: '/img/scooter-rosa.webp', rear: 'Baú traseiro',
    pdf: '/pdf/manual-cappuccino-rosa-demo.pdf',
    pages: [1, 2, 3, 4].map((n) => `/pages/rosa-${n}.webp`),
  },
  verde: {
    id: 'verde', name: 'Verde-água', accent: '#a8d8c5', strong: '#4fb892', tint: '#e3f4ed',
    photo: '/img/scooter-verde.webp', rear: 'Encosto traseiro',
    pdf: '/pdf/manual-cappuccino-verde-demo.pdf',
    pages: [1, 2, 3, 4].map((n) => `/pages/verde-${n}.webp`),
  },
}

export const STATS = [
  { value: 1000, unit: 'W', label: 'Potência' },
  { value: 32, unit: 'km/h', label: 'Velocidade máxima' },
  { value: 150, unit: 'kg', label: 'Carga máxima', prefix: 'Até ' },
  { text: '48V 20Ah', label: 'Bateria de lítio' },
  { text: '50-55', unit: 'km', label: 'Autonomia por carga' },
  { text: '5 a 6', unit: 'h', label: 'Tempo de carregamento' },
]

export const SPECS = [
  ['Modelo', 'Cappuccino'],
  ['Ângulo de subida', '> 9°'],
  ['Distância entre eixos', '1260 mm'],
  ['Sistema de iluminação', 'Luzes completas com sinalização'],
  ['Sistema de partida', 'Chave / Controle remoto'],
  ['Painel', 'LED'],
]

export const PANEL = [
  'Indicador de bateria', 'Indicador de pronto', 'Nível de potência', 'Velocímetro (Km/h)',
  'Farol alto', 'Indicador de iluminação', 'Odômetro', 'Seta',
]

// x e y em % sobre a ilustracao (/img/diagrama.webp)
export const PARTS = [
  { n: 1, name: 'Espelho retrovisor grande angular', x: 35, y: 10.5 },
  { n: 2, name: 'Painel LED digital', x: 31, y: 22 },
  { n: 3, name: 'Farol LED', x: 23, y: 26 },
  { n: 4, name: 'Compartimento de armazenamento', x: 30, y: 38 },
  { n: 5, name: 'Assento para 2 adultos', x: 63, y: 36 },
  { n: 6, name: 'REAR', x: 82, y: 35 },
  { n: 7, name: 'Conector de carregamento', x: 66, y: 52.5 },
  { n: 8, name: 'Bagageiro interno', x: 48, y: 51 },
  { n: 9, name: 'Cavalete de estacionamento', x: 59, y: 76 },
]

export const SAFETY = [
  {
    icon: 'road', title: 'Regras de trânsito e segurança ao dirigir',
    points: [
      'É estritamente proibido que menores de 16 anos conduzam bicicletas elétricas em vias públicas.',
      'Devem circular em faixas não motorizadas; a velocidade máxima não deve exceder 32 km/h. Em vias sem faixa exclusiva, circule pelo lado direito da pista.',
      'Não empreste a bicicleta elétrica a pessoas que não saibam operá-la, para evitar acidentes.',
      'Não transporte pessoas ou objetos além do permitido pela legislação local.',
      'Recomenda-se o uso de capacete ao conduzir.',
      'Na chuva ou neve, a distância de frenagem pode aumentar. Reduza a velocidade e dirija com cautela. Evite circular em clima severo.',
    ],
  },
  {
    icon: 'park', title: 'Segurança no estacionamento e carregamento',
    points: [
      'Não estacione em corredores, escadas de evacuação, passagens ou saídas de emergência.',
      'Não carregue em edifícios residenciais. Mantenha longe de materiais combustíveis durante a carga e evite tempo de carregamento excessivo.',
      'Baterias usadas não devem ser desmontadas sem autorização e devem ser recicladas por departamentos especializados.',
    ],
  },
  {
    icon: 'plug', title: 'Carregador: uso seguro e requisitos',
    points: [
      'Ao substituir o carregador, ele deve corresponder ao modelo da bateria.',
      'Em condições anormais, o carregador deve ter proteção automática e não continuar carregando após conexão invertida ou curto-circuito.',
      'Deve ter proteção contra choque elétrico, com estrutura e carcaça que protejam as partes energizadas acessíveis, exceto carregadores com tensão de pico AC e DC menor ou igual a 42,4 V.',
    ],
  },
  {
    icon: 'wrench', title: 'Ao ajustar o guidão ou o assento',
    points: [
      'Tome cuidado para não expor a linha de segurança marcada no elevador do guidão ou no tubo do selim (quando aplicável).',
    ],
  },
]

export const CHECKLIST = [
  'Circuito de alimentação e iluminação em bom estado',
  'Freios dianteiro e traseiro funcionando normalmente',
  'Guidão e rodas dianteira e traseira bem fixados',
  'Pressão dos pneus verificada',
  'Refletor sem danos ou sujeira',
]
