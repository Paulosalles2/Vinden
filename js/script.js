 (function ensureAutoplay() {
      const v = document.getElementById('bgVideo');
      try { v.muted = true; } catch (_) {}
      // iOS: playsinline + muted permitem autoplay
      const tryPlay = () => v.play().catch(() => {/* ignorar bloqueio até próximo evento */});
      if (v.readyState >= 2) tryPlay(); else v.addEventListener('canplay', tryPlay, { once: true });
      // Retoma após voltar ao foco/aba visível
      document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    })();

  (function loopedOnScrollAnimations(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }

  const applyStagger = (container) => {
    const stagger = parseInt(container.getAttribute('data-stagger') || '0', 10);
    if (!stagger) return;
    let i = 0;
    Array.from(container.children).forEach((child) => {
      if (child.classList.contains('reveal')) {
        child.style.transitionDelay = `${Math.min(i * stagger, 600)}ms`;
        child.classList.add('in');
        i += 1;
      }
    });
  };

  const clearStagger = (container) => {
    Array.from(container.children).forEach((child) => {
      if (child.classList.contains('reveal')) {
        child.classList.remove('in');
        child.style.transitionDelay = '0ms';
      }
    });
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const t = entry.target;
      if (entry.isIntersecting) {
        t.classList.add('in');
        if (t.hasAttribute('data-stagger')) applyStagger(t);
      } else {
        t.classList.remove('in');
        if (t.hasAttribute('data-stagger')) clearStagger(t);
      }
    });
  }, {
    root: null,
    threshold: 0.05,          // antes: 0.2 (podia não disparar)
    rootMargin: '0px 0px -10% 0px'
  });

  // Garante que todos começam “visíveis” se algo falhar
  document.querySelectorAll('.reveal').forEach(el => el.classList.remove('in'));

  // Observe containers e elementos reveláveis
  document.querySelectorAll('[data-anim], .reveal').forEach(el => io.observe(el));
})();
