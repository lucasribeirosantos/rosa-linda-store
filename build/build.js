// Gera site/index.html (+ sitemap, robots, llms.txt, manifest) a partir de produtos.js e template.html.
// Uso: node build/build.js
const fs = require('fs');
const path = require('path');
const { site, categorias, produtos, faq } = require('./produtos');

const ROOT = path.join(__dirname, '..', 'site');
const IMG = path.join(ROOT, 'assets', 'img', 'produtos');
const catName = Object.fromEntries(categorias.map((c) => [c.id, c.nome]));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const wa = (msg) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
const waMsg = (p, cor) => `Olá, tenho interesse no produto ${p.nome}${cor ? `, cor ${cor}` : ''}. Gostaria de receber um orçamento.`;

const priceLabel = (p) =>
  p.price == null ? '<span class="price__q">Sob consulta</span>'
    : `${p.from ? '<small>A partir de</small> ' : ''}${brl(p.price)}${p.unit ? ' <small>/ unidade</small>' : ''}`;
const priceText = (p) =>
  p.price == null ? 'Sob consulta' : `${p.from ? 'A partir de ' : ''}${brl(p.price)}${p.unit ? ' / unidade' : ''}`;

// imagens de cada produto
const imgs = (p) => {
  const out = [];
  for (let i = 1; fs.existsSync(path.join(IMG, `${p.slug}-${i}-480.webp`)); i++) {
    const big = fs.existsSync(path.join(IMG, `${p.slug}-${i}-900.webp`));
    out.push({
      s: `assets/img/produtos/${p.slug}-${i}-480.webp`,
      l: `assets/img/produtos/${p.slug}-${i}-${big ? 900 : 480}.webp`,
      big,
      cor: p.colors[i - 1] || '',
    });
  }
  if (!out.length) throw new Error('Sem imagens para ' + p.slug);
  return out;
};
const srcset = (im) => (im.big ? `${im.s} 480w, ${im.l} 900w` : `${im.s} 480w`);
const alt = (p, cor) => `${p.nome} de crochê feita à mão${cor && !/detalhe|ambientada|mesa posta|coleção/i.test(cor) ? ` na cor ${cor.toLowerCase()}` : ''}`;

const ICON = {
  WA: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>',
  IG: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>',
  HEART: '<svg class="i i--heart" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2 0 3.6 1.1 5.3 3.1 1.7-2 3.3-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z"/></svg>',
  PIX: '<svg class="pay__icon" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M24 5 43 24 24 43 5 24Z"/><path d="M15 16.5h3.2c1.4 0 2.7.6 3.7 1.5L24 20l2.1-2c1-.9 2.3-1.5 3.7-1.5H33M15 31.5h3.2c1.4 0 2.7-.6 3.7-1.5L24 28l2.1 2c1 .9 2.3 1.5 3.7 1.5H33"/></g></svg>',
  CARD: '<svg class="pay__icon" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><rect x="5" y="11" width="38" height="26" rx="4"/><path d="M5 19h38"/><path d="M11 30h8M23 30h4"/></g></svg>',
  DEBIT: '<svg class="pay__icon" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><rect x="5" y="11" width="38" height="26" rx="4"/><rect x="11" y="18" width="8" height="6" rx="1.5"/><path d="M11 30h6M21 30h6M31 30h6"/></g></svg>',
};

const swatches = (p, list) => {
  if (list.length < 2 || p.fotos) return '';
  const MAX = 5;
  const dots = list.slice(0, MAX).map((im, i) =>
    `<button class="sw" type="button" data-i="${i}" aria-label="Cor ${esc(im.cor)}" aria-pressed="${i === 0}" style="--c:${im.hex}"></button>`).join('');
  const more = list.length > MAX ? `<button class="sw sw--more" type="button" data-open="${p.slug}" aria-label="Ver todas as ${list.length} cores">+${list.length - MAX}</button>` : '';
  return `<div class="swatches" aria-label="Cores disponíveis">${dots}${more}</div>`;
};

// cor de cada bolinha (uma por foto), amostrada das fotos na otimização
let manifest = {};
try { manifest = require('./cores.json'); } catch {}

const data = {};
const card = (p, idx) => {
  const list = imgs(p).map((im, i) => ({ ...im, hex: (manifest[p.slug] || [])[i] || '#e9d6cf' }));
  data[p.slug] = {
    nome: p.nome, cat: catName[p.cat], preco: priceText(p), desc: p.desc, fotos: !!p.fotos,
    material: [p.material, p.note].filter(Boolean).join(' · '),
    imgs: list.map(({ s, l, cor, big }) => ({ s, l, cor, big })),
  };
  const first = list[0];
  const second = list[1];
  return `
<article class="card reveal" data-cat="${p.cat}" data-slug="${p.slug}" id="${p.slug}" style="--d:${(idx % 4) * 70}ms">
  <button class="card__media" type="button" data-open="${p.slug}" aria-label="Ver detalhes: ${esc(p.nome)}">
    <img class="card__img" src="${first.s}" srcset="${srcset(first)}" sizes="(min-width: 1180px) 270px, (min-width: 760px) 30vw, 46vw" width="480" height="600" loading="lazy" decoding="async" alt="${esc(alt(p, first.cor))}">
    ${second ? `<img class="card__img card__img--alt" src="${second.s}" width="480" height="600" loading="lazy" decoding="async" alt="">` : ''}
    ${p.best ? '<span class="card__badge">Mais vendida</span>' : ''}
    <span class="card__zoom" aria-hidden="true">Ver detalhes</span>
  </button>
  <div class="card__body">
    <p class="card__cat">${catName[p.cat]}</p>
    <h3 class="card__title">${esc(p.nome)}</h3>
    <p class="card__price">${priceLabel(p)}</p>
    ${swatches(p, list)}
    <a class="btn btn--wa btn--sm" data-wa href="${esc(wa(waMsg(p, list.length > 1 && !p.fotos ? first.cor : '')))}" target="_blank" rel="noopener">${ICON.WA}<span>Pedir orçamento</span></a>
  </div>
</article>`;
};

const bestCard = (p) => {
  const list = imgs(p);
  const im = list[0];
  return `
<article class="best__card reveal">
  <button class="best__media" type="button" data-open="${p.slug}" aria-label="Ver detalhes: ${esc(p.nome)}">
    <img src="${im.l}" srcset="${srcset(im)}" sizes="(min-width: 1000px) 25vw, (min-width: 640px) 45vw, 80vw" width="900" height="1125" loading="lazy" decoding="async" alt="${esc(alt(p, im.cor))}">
  </button>
  <div class="best__info">
    <h3>${esc(p.nome)}</h3>
    <p class="best__price">${priceLabel(p)}</p>
    <p class="best__colors">${list.length} cores na vitrine · mais sob consulta</p>
    <a class="best__link" href="${esc(wa(waMsg(p)))}" target="_blank" rel="noopener">Pedir orçamento <span aria-hidden="true">→</span></a>
  </div>
</article>`;
};

const thread = `
<div class="thread" aria-hidden="true">
  <svg viewBox="0 0 1200 80" preserveAspectRatio="none"><path pathLength="1" d="M0 40 C 150 0, 250 80, 400 40 S 560 0, 600 40 c 10 14 -2 34 -18 28 c -20 -8 -6 -38 14 -32 c 30 10 40 40 80 34 C 820 60, 900 0, 1050 40 S 1180 60, 1200 40"/></svg>
</div>`;

const ribbonItems = ['Feito à mão', 'Crochês com amor', 'Peças sob encomenda', 'Cores sob consulta', 'Pix, crédito e débito'];
const ribbon = ribbonItems.map((t) => `<span>${t}</span>${ICON.HEART}`).join('');

const faqHtml = faq.map(([q, a], i) => `
<details class="faq__item reveal"${i === 0 ? ' open' : ''}>
  <summary><h3>${esc(q)}</h3><span class="faq__plus" aria-hidden="true"></span></summary>
  <div class="faq__a"><p>${esc(a)}</p></div>
</details>`).join('');

// ---------- JSON-LD ----------
const url = site.url;
const productLd = (p) => {
  const list = imgs(p);
  const ld = {
    '@type': 'Product',
    '@id': `${url}#${p.slug}`,
    name: p.nome,
    description: p.desc,
    image: list.map((im) => url + im.l),
    brand: { '@type': 'Brand', name: site.name },
    category: catName[p.cat],
    material: p.material || 'Fio de crochê',
    color: p.colors.filter((c) => !/detalhe|ambientada|mesa posta|coleção/i.test(c)).join(', ') || undefined,
    url: `${url}#${p.slug}`,
  };
  if (p.price != null) {
    ld.offers = {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/MadeToOrder',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${url}#loja` },
      url: `${url}#${p.slug}`,
      ...(p.from || p.unit ? {
        priceSpecification: {
          '@type': 'UnitPriceSpecification', priceCurrency: 'BRL',
          ...(p.from ? { minPrice: p.price.toFixed(2) } : { price: p.price.toFixed(2) }),
          ...(p.unit ? { referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'C62' } } : {}),
        },
      } : {}),
    };
  }
  return ld;
};

const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Store',
      '@id': `${url}#loja`,
      name: site.name,
      alternateName: 'Rosa Linda — Crochês com amor',
      slogan: 'Crochês com amor',
      description: 'Loja de crochê artesanal: bolsas, sousplats, tapetes, passadeiras, almofadas e roupas de crochê feitas à mão, sob encomenda.',
      url,
      logo: `${url}assets/img/logo.webp`,
      image: `${url}assets/img/og-image.jpg`,
      telephone: '+55-38-99882-3210',
      priceRange: 'R$ 30 – R$ 250',
      currenciesAccepted: 'BRL',
      paymentAccepted: 'Pix, Cartão de crédito, Cartão de débito',
      areaServed: { '@type': 'Country', name: 'Brasil' },
      sameAs: [site.instagram],
      contactPoint: {
        '@type': 'ContactPoint', telephone: '+55-38-99882-3210', contactType: 'sales',
        availableLanguage: 'Portuguese', url: `https://wa.me/${site.whatsapp}`,
      },
      knowsAbout: ['Crochê', 'Artesanato', 'Bolsa de crochê', 'Sousplat de crochê', 'Tapete de crochê'],
    },
    {
      '@type': 'WebSite', '@id': `${url}#site`, url, name: site.name, inLanguage: 'pt-BR',
      publisher: { '@id': `${url}#loja` },
    },
    {
      '@type': 'WebPage', '@id': `${url}#pagina`, url, inLanguage: 'pt-BR',
      name: 'Rosa Linda Store | Crochês feitos à mão',
      isPartOf: { '@id': `${url}#site` }, about: { '@id': `${url}#loja` },
      primaryImageOfPage: `${url}assets/img/produtos/bolsa-aurora-1-900.webp`,
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.hero__title', '.hero__lead', '.faq__item'] },
    },
    {
      '@type': 'ItemList', '@id': `${url}#catalogo`, name: 'Catálogo Rosa Linda Store',
      numberOfItems: produtos.length,
      itemListElement: produtos.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: productLd(p) })),
    },
    {
      '@type': 'FAQPage', '@id': `${url}#duvidas`,
      mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ],
};

// ---------- monta ----------
const cards = produtos.map(card).join('');
const html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
  .replaceAll('{{URL}}', url)
  .replace('{{JSONLD}}', JSON.stringify(jsonld).replace(/</g, '\\u003c'))
  .replace('{{BEST}}', produtos.filter((p) => p.best).map(bestCard).join(''))
  .replace('{{FILTERS}}', categorias.map((c) => `<button role="tab" aria-selected="false" data-filter="${c.id}">${c.nome}</button>`).join('\n          '))
  .replace('{{CARDS}}', cards)
  .replace('{{FAQ}}', faqHtml)
  .replace('{{CATALOGO}}', JSON.stringify({ wa: site.whatsapp, itens: data }).replace(/</g, '\\u003c'))
  .replaceAll('{{RIBBON}}', `<div class="ribbon__group">${ribbon}</div>`)
  .replaceAll('{{THREAD}}', thread)
  .replaceAll('{{TOTAL}}', String(produtos.length))
  .replaceAll('{{WA_GERAL}}', esc(wa('Olá, vim pelo site da Rosa Linda Store e gostaria de receber um orçamento.')))
  .replaceAll('{{WA_DISPLAY}}', site.whatsappDisplay)
  .replaceAll('{{INSTAGRAM}}', site.instagram)
  .replaceAll('{{INSTAGRAM_HANDLE}}', site.instagramHandle)
  .replaceAll('{{ICON_WA}}', ICON.WA)
  .replaceAll('{{ICON_IG}}', ICON.IG)
  .replaceAll('{{ICON_HEART}}', ICON.HEART)
  .replaceAll('{{ICON_PIX}}', ICON.PIX)
  .replaceAll('{{ICON_CARD}}', ICON.CARD)
  .replaceAll('{{ICON_DEBIT}}', ICON.DEBIT);

const left = html.match(/\{\{[A-Z_]+\}\}/);
if (left) throw new Error('Placeholder não substituído: ' + left[0]);
fs.writeFileSync(path.join(ROOT, 'index.html'), html);

// ---------- arquivos de SEO/AEO ----------
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n`);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${produtos.map((p) => `    <image:image><image:loc>${url}${imgs(p)[0].l}</image:loc><image:title>${esc(p.nome)}</image:title></image:image>`).join('\n')}
  </url>
</urlset>
`);
fs.writeFileSync(path.join(ROOT, 'llms.txt'),
  `# ${site.name}

> Loja de crochê artesanal ("Crochês com amor"). Todas as peças são feitas à mão, sob encomenda, em diversas cores. Não há checkout online: os pedidos são feitos por orçamento via WhatsApp ${site.whatsappDisplay} (https://wa.me/${site.whatsapp}). Pagamento: Pix, cartão de crédito e cartão de débito. Instagram: ${site.instagram}

## Catálogo e preços
${categorias.map((c) => `\n### ${c.nome}\n` + produtos.filter((p) => p.cat === c.id).map((p) =>
    `- ${p.nome}: ${priceText(p)}. ${p.desc}${p.colors.length > 1 ? ` Cores na vitrine: ${p.colors.filter((x) => !/detalhe|ambientada|mesa posta/i.test(x)).join(', ')}.` : ''}`).join('\n')).join('\n')}

## Perguntas frequentes
${faq.map(([q, a]) => `\n**${q}**\n${a}`).join('\n')}
`);
fs.writeFileSync(path.join(ROOT, 'site.webmanifest'), JSON.stringify({
  name: site.name, short_name: 'Rosa Linda', lang: 'pt-BR', start_url: '/', display: 'standalone',
  background_color: '#FFF9F5', theme_color: '#D97378',
  icons: [
    { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));

console.log(`OK — ${produtos.length} produtos, ${(html.length / 1024).toFixed(0)} KB de HTML`);
