// Catálogo da Rosa Linda Store — edite aqui nomes, preços e descrições
// e rode `node build/build.js` para regenerar site/index.html.
// price: número (R$) | from: true => "A partir de" | unit: true => "Unidade"
// price: null => "Sob consulta"
// fotos: true => as fotos são ângulos da mesma peça (sem bolinhas de cor)
// colors: um nome por foto, na mesma ordem dos arquivos <slug>-1, <slug>-2, ...

module.exports = {
  site: {
    url: 'https://rosa-linda.vercel.app/', // troque pelo domínio final quando tiver um próprio
    name: 'Rosa Linda Store',
    whatsapp: '5538998823210',
    whatsappDisplay: '+55 (38) 99882-3210',
    instagram: 'https://www.instagram.com/rosalinda.store_/',
    instagramHandle: '@rosalinda.store_',
  },

  categorias: [
    { id: 'bolsas', nome: 'Bolsas' },
    { id: 'sousplats', nome: 'Sousplats' },
    { id: 'tapetes', nome: 'Tapetes & Passadeiras' },
    { id: 'almofadas', nome: 'Almofadas' },
    { id: 'roupas', nome: 'Roupas' },
  ],

  produtos: [
    {
      slug: 'bolsa-emily', nome: 'Bolsa Emily', cat: 'bolsas', price: 179.9, best: true,
      desc: 'Bolsa de crochê feita à mão com fio Náutico 100% poliéster, alça em corrente e fecho dourado.',
      material: 'Fio Náutico 100% poliéster',
      colors: ['Off-white', 'Vermelho'],
      note: 'Diversas cores sob consulta',
    },
    {
      slug: 'bolsa-serena', nome: 'Bolsa Serena', cat: 'bolsas', price: 120, best: true,
      desc: 'Bolsa de crochê feita com fio de malha, toque macio e estrutura firme para o dia a dia.',
      material: 'Fio de malha',
      colors: ['Chocolate', 'Azul royal', 'Azul céu', 'Verde lima', 'Terracota', 'Vermelho', 'Uva', 'Rosé'],
      note: 'Diversas cores sob consulta',
    },
    {
      slug: 'bolsa-aurora', nome: 'Bolsa Aurora', cat: 'bolsas', price: 150, best: true,
      desc: 'Bolsa de tela feita com fio Náutico ou de malha, com alça em corrente dourada e fecho metálico.',
      material: 'Fio Náutico ou fio de malha',
      colors: ['Nude', 'Rosé', 'Verde oliva', 'Roxo', 'Pink', 'Azul', 'Azul claro', 'Taupe', 'Vinho', 'Vermelho', 'Preto'],
      note: 'Coleção Aurora — cores sob consulta',
    },
    {
      slug: 'bolsa-yara', nome: 'Bolsa Yara', cat: 'bolsas', price: 65, best: true,
      desc: 'Bolsa artesanal de crochê feita à mão com fio barroco, pontos em relevo e alça transversal.',
      material: 'Fio barroco',
      colors: ['Azul claro', 'Verde', 'Amarelo', 'Azul royal', 'Verde menta', 'Pink', 'Rosa claro', 'Lilás', 'Azul piscina', 'Verde bandeira', 'Rosa bebê', 'Mostarda'],
    },
    {
      slug: 'bolsa-chanel', nome: 'Bolsa Chanel', cat: 'bolsas', price: 250,
      desc: 'Bolsa artesanal de crochê feita à mão com fio Náutico 100% poliéster em tela, acabamento matelassê e corrente dourada.',
      material: 'Fio Náutico 100% poliéster em tela',
      colors: ['Off-white e preto'],
    },
    {
      slug: 'bolsa-origami', nome: 'Bolsa Origami', cat: 'bolsas', price: 99.9,
      desc: 'Bolsa artesanal de crochê feita à mão com fio barroco, formato origami e listras coloridas.',
      material: 'Fio barroco',
      colors: ['Listrada'],
    },
    {
      slug: 'colecao-rosa-linda', nome: 'Bolsa Coleção Rosa Linda', cat: 'bolsas', price: 75,
      desc: 'Bolsas da coleção autoral Rosa Linda, feitas à mão em crochê com acabamento delicado.',
      colors: ['Coleção'],
      note: 'Modelos e cores sob consulta',
    },

    {
      slug: 'sousplat-arabesco', nome: 'Sousplat Arabesco', cat: 'sousplats', price: 35, unit: true,
      desc: 'Sousplat redondo de crochê com borda rendada em arabescos, para uma mesa posta encantadora.',
      colors: ['Pink', 'Verde lima', 'Azul royal', 'Verde', 'Cru'],
    },
    {
      slug: 'sousplat-boreal', nome: 'Sousplat Boreal', cat: 'sousplats', price: 40, unit: true,
      desc: 'Sousplat de crochê com coroa de pérolas douradas e borda floral — sofisticação para ocasiões especiais.',
      colors: ['Lilás', 'Pink', 'Azul claro', 'Azul marinho', 'Rosa', 'Azul petróleo'],
    },
    {
      slug: 'sousplat-royale', nome: 'Sousplat Royale', cat: 'sousplats', price: 30, unit: true,
      desc: 'Sousplat redondo de crochê com desenho em espiral e borda ondulada.',
      colors: ['Cru', 'Azul claro', 'Rosa', 'Lilás'],
    },
    {
      slug: 'sousplat-toscana', nome: 'Sousplat Toscana', cat: 'sousplats', price: 30, unit: true,
      desc: 'Sousplat quadrado de crochê em ponto vazado, com borda ondulada e visual clássico.',
      colors: ['Cru', 'Azul turquesa', 'Rosé', 'Azul claro', 'Verde'],
    },
    {
      slug: 'sousplat-florenca', nome: 'Sousplat Florença', cat: 'sousplats', price: 40, unit: true,
      desc: 'Sousplat de crochê em formato de flor, que transforma a mesa em um jardim.',
      colors: ['Rosa', 'Laranja', 'Branco', 'Azul claro', 'Vermelho'],
    },
    {
      slug: 'sousplat-imperial', nome: 'Sousplat Imperial', cat: 'sousplats', price: 40, unit: true,
      desc: 'Sousplat de crochê em tom cru com detalhes dourados — elegância para jantares e eventos.',
      colors: ['Cru e dourado', 'Mesa posta', 'Detalhe'], fotos: true,
    },

    {
      slug: 'passadeira-veneza', nome: 'Passadeira Veneza', cat: 'tapetes', price: 200, from: true,
      desc: 'Passadeira oval de crochê em faixas de chocolate, cru e bege, perfeita para corredores e cozinhas.',
      colors: ['Chocolate e cru', 'Ambientada'], fotos: true,
    },
    {
      slug: 'passadeira-dalia', nome: 'Passadeira Dália', cat: 'tapetes', price: 160, from: true,
      desc: 'Passadeira oval de crochê com centro em chocolate e borda cru.',
      colors: ['Chocolate e cru'],
    },
    {
      slug: 'tapete-flora', nome: 'Tapete Flora', cat: 'tapetes', price: 90, from: true,
      desc: 'Tapete retangular de crochê em faixas de terracota, verde e cru.',
      colors: ['Terracota e verde'],
    },
    {
      slug: 'tapete-magnolia', nome: 'Tapete Magnólia', cat: 'tapetes', price: 189.9,
      desc: 'Tapete redondo de crochê em rosa e azul, com borda rendada.',
      colors: ['Rosa e azul'],
    },
    {
      slug: 'tapete-celeste', nome: 'Tapete Celeste', cat: 'tapetes', price: 140,
      desc: 'Tapete redondo de crochê em espiral azul royal.',
      colors: ['Azul royal'],
    },
    {
      slug: 'tapete-luna', nome: 'Tapete Luna', cat: 'tapetes', price: 200, from: true,
      desc: 'Tapete oval de crochê em tons de rosa, ideal para quartos aconchegantes.',
      colors: ['Rosa'],
    },

    {
      slug: 'almofadas', nome: 'Almofadas de Crochê', cat: 'almofadas', price: null,
      desc: 'Capas de almofada em crochê no estilo granny square, feitas à mão para deixar a sala mais acolhedora.',
      colors: ['Verde lima', 'Cru e amarelo', 'Rosa e cru', 'Azul', 'Rosa'],
      note: 'Modelos e cores sob consulta',
    },
    {
      slug: 'vestido-croche', nome: 'Vestido de Crochê', cat: 'roupas', price: null,
      desc: 'Vestido de crochê feito à mão sob medida, com recortes delicados e caimento elegante.',
      colors: ['Branco', 'Detalhe'], fotos: true,
      note: 'Peça sob medida — orçamento personalizado',
    },
  ],

  faq: [
    ['Como faço para comprar uma peça da Rosa Linda Store?',
      'Escolha a peça no catálogo e toque em “Pedir orçamento”. Você será direcionada ao nosso WhatsApp com a mensagem pronta; lá combinamos cor, tamanho, prazo e entrega.'],
    ['As peças são feitas à mão?',
      'Sim. Todas as peças são feitas à mão, ponto a ponto, em crochê. Por isso cada uma é única e pode ter pequenas variações que fazem parte do charme artesanal.'],
    ['Posso escolher a cor da minha peça?',
      'Pode! A maioria dos modelos é produzida em diversas cores sob consulta. Envie a cor desejada pelo WhatsApp e verificamos a disponibilidade do fio.'],
    ['Quais formas de pagamento são aceitas?',
      'Aceitamos Pix, cartão de crédito e cartão de débito.'],
    ['Por que os preços são por orçamento?',
      'Como cada peça é produzida sob encomenda, o valor final pode variar conforme cor, tamanho, quantidade e acabamento. Os preços do catálogo são a base para o seu orçamento.'],
    ['Qual o prazo de produção?',
      'O prazo depende da peça e da quantidade. Informamos o prazo exato no orçamento pelo WhatsApp, antes de você confirmar o pedido.'],
    ['Os sousplats são vendidos por unidade?',
      'Sim, o valor dos sousplats é por unidade. Para jogos completos (4, 6 ou 8 lugares) é só pedir o orçamento.'],
  ],
};
