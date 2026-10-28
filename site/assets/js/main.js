(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { wa, itens } = JSON.parse($('#catalogo').textContent);

  const waLink = (nome, cor) =>
    `https://wa.me/${wa}?text=${encodeURIComponent(`Olá, tenho interesse no produto ${nome}${cor ? `, cor ${cor}` : ''}. Gostaria de receber um orçamento.`)}`;

  /* header + FAB */
  const header = $('.header');
  const fab = $('.fab');
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    fab.classList.toggle('is-on', y > innerHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  const burger = $('.burger');
  const nav = $('#nav');
  const setNav = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', (e) => e.key === 'Escape' && nav.classList.contains('is-open') && setNav(false));

  /* reveal on scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach((el) => io.observe(el));

  /* thread lines draw with scroll */
  const threads = $$('.thread path, .steps__thread path');
  if (reduce) threads.forEach((p) => p.style.setProperty('--p', 0));
  else {
    let ticking = false;
    const drawThreads = () => {
      ticking = false;
      const vh = innerHeight;
      threads.forEach((p) => {
        const r = p.ownerSVGElement.getBoundingClientRect();
        const t = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.6)));
        p.style.setProperty('--p', (1 - t).toFixed(3));
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(drawThreads); } }, { passive: true });
    drawThreads();
  }

  /* hero parallax on pointer */
  const art = $('.hero__art');
  if (art && !reduce && matchMedia('(hover: hover)').matches) {
    const layers = [[$('.hero__novelo', art), 18], [$('.hero__circle', art), -10], [$('.hero__arch img', art), -6]];
    let raf;
    $('.hero').addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / innerWidth - 0.5;
        const y = e.clientY / innerHeight - 0.5;
        layers.forEach(([el, k]) => el && (el.style.transform = `translate3d(${x * k}px, ${y * k}px, 0)${el.tagName === 'IMG' && el.closest('.hero__arch') ? ' scale(1.04)' : ''}`));
      });
    });
  }

  /* filters */
  const filters = $('.filters');
  const pill = $('.filters__pill');
  const tabs = $$('[data-filter]', filters);
  const cards = $$('.card');
  const movePill = (btn) => {
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.transform = `translateX(${btn.offsetLeft}px)`;
  };
  const applyFilter = (btn) => {
    const f = btn.dataset.filter;
    tabs.forEach((t) => t.setAttribute('aria-selected', t === btn));
    movePill(btn);
    btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    const show = (c) => f === 'todos' || c.dataset.cat === f;
    cards.forEach((c) => !show(c) && !c.classList.contains('is-hidden') && c.classList.add('is-leaving'));
    setTimeout(() => {
      let i = 0;
      cards.forEach((c) => {
        c.classList.remove('is-leaving');
        if (show(c)) {
          const wasHidden = c.classList.contains('is-hidden');
          c.classList.remove('is-hidden');
          if (wasHidden || f !== 'todos') {
            c.classList.remove('is-in');
            c.style.setProperty('--d', `${Math.min(i, 8) * 60}ms`);
            requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-in')));
          }
          i++;
        } else c.classList.add('is-hidden');
      });
    }, reduce ? 0 : 240);
  };
  tabs.forEach((t) => t.addEventListener('click', () => applyFilter(t)));
  const syncPill = () => movePill(tabs.find((t) => t.getAttribute('aria-selected') === 'true'));
  addEventListener('resize', syncPill);
  document.fonts?.ready.then(syncPill);
  syncPill();

  /* swatches: troca foto + cor da mensagem */
  $$('.card').forEach((card) => {
    const item = itens[card.dataset.slug];
    const img = $('.card__img', card);
    const link = $('[data-wa]', card);
    $$('.sw[data-i]', card).forEach((sw) => {
      const im = item.imgs[+sw.dataset.i];
      const pre = () => { const p = new Image(); p.src = im.s; };
      sw.addEventListener('pointerenter', pre, { once: true });
      sw.addEventListener('click', () => {
        $$('.sw[data-i]', card).forEach((s) => s.setAttribute('aria-pressed', s === sw));
        card.dataset.i = sw.dataset.i;
        img.animate?.([{ opacity: 0.25 }, { opacity: 1 }], { duration: reduce ? 1 : 450, easing: 'ease-out' });
        img.srcset = im.big ? `${im.s} 480w, ${im.l} 900w` : `${im.s} 480w`;
        img.src = im.s;
        img.alt = `${item.nome} de crochê feita à mão na cor ${im.cor.toLowerCase()}`;
        link.href = waLink(item.nome, im.cor);
      });
    });
  });

  /* modal */
  const modal = $('#modal');
  const mImg = $('#modal-img');
  const thumbs = $('#modal-thumbs');
  let current;
  const showImg = (i) => {
    const im = current.imgs[i];
    $$('button', thumbs).forEach((b, j) => b.setAttribute('aria-pressed', i === j));
    mImg.classList.add('is-swapping');
    const done = () => {
      mImg.src = im.l;
      mImg.alt = `${current.nome}${current.fotos ? '' : ` na cor ${im.cor.toLowerCase()}`}`;
      mImg.onload = () => mImg.classList.remove('is-swapping');
      if (mImg.complete) mImg.classList.remove('is-swapping');
    };
    reduce ? done() : setTimeout(done, 180);
    $('#modal-color').textContent = current.fotos ? current.imgs[0].cor : im.cor;
    $('#modal-wa').href = waLink(current.nome, current.fotos ? '' : im.cor);
  };
  const openModal = (slug, i = 0) => {
    current = itens[slug];
    $('#modal-cat').textContent = current.cat;
    $('#modal-title').textContent = current.nome;
    $('#modal-price').textContent = current.preco;
    $('#modal-desc').textContent = current.desc;
    $('#modal-material').textContent = current.material;
    thumbs.innerHTML = current.imgs.length > 1
      ? current.imgs.map((im, j) => `<button type="button" aria-label="${current.fotos ? `Foto ${j + 1}` : `Cor ${im.cor}`}"><img src="${im.s}" alt="" loading="lazy"></button>`).join('')
      : '';
    thumbs.hidden = current.imgs.length < 2;
    $$('button', thumbs).forEach((b, j) => b.addEventListener('click', () => showImg(j)));
    mImg.src = current.imgs[i].l;
    showImg(i);
    modal.showModal();
    document.body.style.overflow = 'hidden';
    history.replaceState(null, '', `#${slug}`);
  };
  const closeModal = () => {
    if (!modal.open) return;
    if (reduce) return modal.close();
    modal.classList.add('is-closing');
    setTimeout(() => { modal.classList.remove('is-closing'); modal.close(); }, 280);
  };
  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname + location.search);
  });
  modal.addEventListener('cancel', (e) => { e.preventDefault(); closeModal(); });
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open]');
    if (!t) return;
    const card = t.closest('.card');
    openModal(t.dataset.open, card?.dataset.i ? +card.dataset.i : 0);
  });

  /* deep link: /#bolsa-aurora abre a peça */
  const hash = decodeURIComponent(location.hash.slice(1));
  if (itens[hash]) {
    $(`#${CSS.escape(hash)}`)?.scrollIntoView();
    setTimeout(() => openModal(hash), 400);
  }

  /* FAQ: fecha os outros ao abrir um */
  $$('.faq__item').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) $$('.faq__item').forEach((o) => o !== d && (o.open = false));
  }));

  $('#ano').textContent = new Date().getFullYear();
})();
