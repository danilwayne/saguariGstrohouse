/* =========================================================
   SAGUARI GASTRO HOUSE — interações
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Nav sólida ao rolar + botão WhatsApp ---------- */
  var nav = document.getElementById('nav');
  var wa = document.getElementById('wa');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('nav--solid', y > 40);
    wa.classList.toggle('is-visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');

  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---------- Carregamento de imagens com fallback elegante ----------
     Cada elemento com data-img só recebe a foto DEPOIS que ela carrega.
     Se o arquivo ainda não existe, o gradiente do CSS permanece — nada quebra.
     Basta jogar as fotos em assets/img/ com os nomes indicados no HTML. */
  document.querySelectorAll('[data-img]').forEach(function (el) {
    var src = el.getAttribute('data-img');
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      var current = getComputedStyle(el).backgroundImage;
      el.style.backgroundImage = 'url("' + src + '"), ' + current;
      el.style.backgroundSize = 'cover';
      // data-pos permite reenquadrar fotos verticais em slots horizontais
      el.style.backgroundPosition = el.getAttribute('data-pos') || 'center';
      el.classList.add('has-img');
    };
    // Na galeria, quadro sem foto some em vez de virar bloco verde vazio.
    probe.onerror = function () {
      if (el.classList.contains('gallery__item')) el.remove();
    };
    probe.src = src;
  });

  /* ---------- Reveal on scroll ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Parallax suave no hero ---------- */
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        heroBg.style.transform = 'scale(1.06) translateY(' + y * 0.18 + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }
})();
