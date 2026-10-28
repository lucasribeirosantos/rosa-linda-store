# Rosa Linda Store — site

O site está pronto na pasta `site/`, que é a pasta que vai para a hospedagem (Netlify, Vercel, Hostinger, GitHub Pages...).

## Editar produtos e preços
1. Edite `build/produtos.js` (nomes, preços, descrições, cores, FAQ, domínio, WhatsApp).
2. Rode `node build/build.js`. Isso regenera `site/index.html`, `sitemap.xml`, `robots.txt`, `llms.txt` e `site.webmanifest`.

Fotos: `site/assets/img/produtos/<slug>-<n>-480.webp` e `-900.webp` (proporção 4:5). Para adicionar uma cor nova, coloque a foto com o próximo número e acrescente o nome da cor em `colors`.

## Antes de publicar
- O `vercel.json` publica a pasta `site/`. Troque `site.url` em `build/produtos.js` pelo domínio real e rode o build de novo (canonical, Open Graph, sitemap e schema dependem dele).
- Cadastre o site no Google Search Console e envie o `sitemap.xml`.

## Testar localmente
```bash
npx -y http-server@14.1.1 site -p 4321 -c-1
```
