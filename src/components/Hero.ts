/* ==========================================================================
   Hero Component - Already rendered in index.html, but could be dynamic
   ========================================================================== */

export function initHero(): void {
  // Hero animations are handled by animation-engine.ts
  // Parallax effect on background
  const heroBg = document.querySelector('.hero-background');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero) {
          const heroHeight = hero.offsetHeight;
          if (scrolled < heroHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}