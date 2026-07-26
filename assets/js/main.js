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
  var pendentes = 0, percorrendo = true;

  function encerrou() {
    if (percorrendo || pendentes > 0) return;
    document.dispatchEvent(new CustomEvent('imagens:prontas'));
  }

  document.querySelectorAll('[data-img]').forEach(function (el) {
    var src = el.getAttribute('data-img');
    if (!src) return;
    pendentes++;
    var probe = new Image();
    probe.onload = function () {
      var current = getComputedStyle(el).backgroundImage;
      el.style.backgroundImage = 'url("' + src + '"), ' + current;
      el.style.backgroundSize = 'cover';
      // data-pos permite reenquadrar fotos verticais em slots horizontais
      el.style.backgroundPosition = el.getAttribute('data-pos') || 'center';
      el.classList.add('has-img');
      pendentes--; encerrou();
    };
    // Na galeria, quadro sem foto some em vez de virar bloco verde vazio.
    probe.onerror = function () {
      if (el.classList.contains('gallery__item')) el.remove();
      pendentes--; encerrou();
    };
    probe.src = src;
  });

  percorrendo = false;
  encerrou();

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

  /* ---------- Slideshow do hero ----------
     Só entram no rodízio as fotos que realmente carregaram (classe .has-img),
     então trocar/remover um arquivo em assets/img/ não quebra nada. */
  (function heroSlideshow() {
    var slides = [].slice.call(document.querySelectorAll('.hero__slide'));
    if (!slides.length) return;

    var INTERVALO = 7000;   // tempo de cada foto
    var FADE = 2000;        // duracao do crossfade (igual ao CSS)
    var atual = 0, timer = null, vivos = [];

    function mostrar(i) {
      vivos.forEach(function (s, n) {
        if (n === i) {
          s.classList.remove('is-leaving');
          s.classList.add('is-active');
        } else if (s.classList.contains('is-active')) {
          s.classList.remove('is-active');
          s.classList.add('is-leaving');
          // Só encerra a animação depois que a foto já sumiu de vez.
          setTimeout(function () {
            if (!s.classList.contains('is-active')) s.classList.remove('is-leaving');
          }, FADE);
        }
      });
      atual = i;
    }

    function proximo() { mostrar((atual + 1) % vivos.length); }

    // O rodizio roda mesmo com "reduzir animacoes" ligado no sistema: trocar a
    // foto e um crossfade, nao movimento. Quem desliga so perde o zoom/pan,
    // que e o que de fato incomoda quem tem sensibilidade a movimento (o CSS
    // corta a animacao kenburns via @media prefers-reduced-motion).
    function agendar() {
      clearInterval(timer);
      if (vivos.length > 1) timer = setInterval(proximo, INTERVALO);
    }

    var montado = false;

    function montar() {
      if (montado) return;
      montado = true;

      vivos = slides.filter(function (s) { return s.classList.contains('has-img'); });

      // Nenhuma foto disponível: deixa o gradiente do CSS assumir.
      if (!vivos.length) return;

      slides.forEach(function (s) { if (vivos.indexOf(s) === -1) s.remove(); });

      mostrar(0);
      agendar();
    }

    // Monta quando todas as fotos terminarem de carregar (ou falhar).
    document.addEventListener('imagens:prontas', montar);
    // Rede muito lenta: não deixa o hero preso no gradiente para sempre.
    setTimeout(montar, 4000);

    // Aba em segundo plano não precisa girar foto.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer); else agendar();
    });
  })();

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
