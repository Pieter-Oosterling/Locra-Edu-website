/* ==========================================================================
   Scroll Reveal — Enhanced IntersectionObserver for staggered reveals
   ========================================================================== */

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export class ScrollReveal {
  private observer: IntersectionObserver | null = null;
  private options: Required<RevealOptions>;
  private elements: Set<Element> = new Set();

  constructor(options: RevealOptions = {}) {
    this.options = {
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
      once: options.once ?? true
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  private init(): void {
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealAll();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          if (this.options.once) {
            this.observer?.unobserve(entry.target);
          }
        } else if (!this.options.once) {
          entry.target.classList.remove('is-revealed');
        }
      });
    }, {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    });

    this.observeAll();
  }

  public observe(element: Element): void {
    if (this.elements.has(element)) return;
    
    element.classList.add('reveal');
    this.elements.add(element);
    
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  public observeAll(selector = '.reveal, [data-reveal], .reveal-grid'): void {
    document.querySelectorAll(selector).forEach((el) => this.observe(el));
  }

  public unobserve(element: Element): void {
    this.elements.delete(element);
    this.observer?.unobserve(element);
  }

  private revealAll(): void {
    document.querySelectorAll('.reveal, [data-reveal], .reveal-grid').forEach((el) => {
      el.classList.add('is-revealed');
    });
  }

  public destroy(): void {
    this.observer?.disconnect();
    this.elements.clear();
  }
}

// Auto-initialize for elements with data-reveal
export const scrollReveal = new ScrollReveal();

// Export for manual use
export function createScrollReveal(options?: RevealOptions): ScrollReveal {
  return new ScrollReveal(options);
}