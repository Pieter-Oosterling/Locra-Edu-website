/* ==========================================================================
   Animation Engine — Scroll-triggered reveals with IntersectionObserver
   ========================================================================== */

interface AnimationOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

interface AnimatedElement {
  element: HTMLElement;
  animation: string;
  delay: number;
  resolved: boolean;
}

export class AnimationEngine {
  private observer: IntersectionObserver | null = null;
  private elements: Map<HTMLElement, AnimatedElement> = new Map();
  private options: Required<AnimationOptions>;
  private prefersReducedMotion: boolean;

  constructor(options: AnimationOptions = {}) {
    this.options = {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
      threshold: options.threshold ?? [0.1, 0.3, 0.5],
      once: options.once ?? true
    };

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!this.prefersReducedMotion) {
      this.initObserver();
      this.observeExistingElements();
      this.setupMutationObserver();
    } else {
      // Immediately reveal all elements if reduced motion
      this.revealAllImmediately();
    }

    // Listen for theme changes to re-evaluate
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (e.matches) {
        this.destroy();
        this.revealAllImmediately();
      } else {
        this.initObserver();
        this.observeExistingElements();
      }
    });
  }

  private initObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const animated = this.elements.get(entry.target as HTMLElement);
        if (!animated || animated.resolved) return;

        if (entry.isIntersecting) {
          this.triggerAnimation(animated);
        }
      });
    }, {
      root: this.options.root,
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });
  }

  private observeExistingElements(): void {
    document.querySelectorAll<HTMLElement>('[data-animate]').forEach((el) => {
      this.observeElement(el);
    });
  }

  private setupMutationObserver(): void {
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (el.hasAttribute('data-animate')) {
              this.observeElement(el);
            }
            el.querySelectorAll<HTMLElement>('[data-animate]').forEach((child) => {
              this.observeElement(child);
            });
          }
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });
  }

  public observeElement(element: HTMLElement): void {
    if (this.elements.has(element)) return;

    const animation = element.dataset.animate || 'fade-up';
    const delay = parseInt(element.dataset.delay || '0', 10);

    this.elements.set(element, {
      element,
      animation,
      delay,
      resolved: false
    });

    // Set initial state
    this.setInitialState(element, animation);

    if (this.observer) {
      this.observer.observe(element);
    }
  }

  private setInitialState(element: HTMLElement, animation: string): void {
    // Initial styles are set via CSS [data-animate] selectors
    // This ensures they're applied before JS runs
    element.style.willChange = 'opacity, transform';
  }

  private triggerAnimation(animated: AnimatedElement): void {
    const { element, delay, animation } = animated;
    
    animated.resolved = true;

    // Apply delay
    setTimeout(() => {
      element.classList.add('is-visible');
      
      // Handle stagger children
      const staggerContainer = element.closest('.stagger-children');
      if (staggerContainer && staggerContainer === element) {
        staggerContainer.classList.add('is-visible');
      }

      // Handle reveal grids
      const revealGrid = element.closest('.reveal-grid');
      if (revealGrid && revealGrid === element) {
        revealGrid.classList.add('is-revealed');
      }

      // Clean up will-change after animation
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, 500);
    }, delay);

    if (this.options.once && this.observer) {
      this.observer.unobserve(element);
    }
  }

  private revealAllImmediately(): void {
    document.querySelectorAll<HTMLElement>('[data-animate]').forEach((el) => {
      el.classList.add('is-visible');
      el.style.willChange = 'auto';
    });
    document.querySelectorAll('.stagger-children').forEach((el) => {
      el.classList.add('is-visible');
    });
    document.querySelectorAll('.reveal-grid').forEach((el) => {
      el.classList.add('is-revealed');
    });
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.elements.clear();
  }

  public refresh(): void {
    this.elements.forEach((animated, element) => {
      if (!animated.resolved && this.observer) {
        // Re-check intersection
        const rect = element.getBoundingClientRect();
        const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0;
        if (isIntersecting) {
          this.triggerAnimation(animated);
        }
      }
    });
  }
}

// Export singleton instance
export const animationEngine = new AnimationEngine();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Engine already initialized in constructor
  });
} else {
  // Already loaded
}