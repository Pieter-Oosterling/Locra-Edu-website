/* ==========================================================================
   Navigation — Header, mobile menu, smooth scroll
   ========================================================================== */

export class Navigation {
  private header: HTMLElement | null = null;
  private mobileMenuBtn: HTMLButtonElement | null = null;
  private mobileNav: HTMLElement | null = null;
  private mobileNavBackdrop: HTMLElement | null = null;
  private navLinks: NodeListOf<HTMLAnchorElement> | null = null;
  private lastScrollY = 0;
  private isScrolled = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    this.header = document.getElementById('site-header');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (!this.header) return;

    // Mobile menu toggle
    this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
    this.mobileNavBackdrop?.addEventListener('click', () => this.closeMobileMenu());

    // Close mobile menu on link click
    this.mobileNav?.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
    });

    // Scroll effects
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Keyboard navigation for mobile menu
    this.mobileNav?.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  private toggleMobileMenu(): void {
    const isOpen = this.mobileNav?.classList.toggle('open');
    this.mobileNavBackdrop?.classList.toggle('open');
    this.mobileMenuBtn?.setAttribute('aria-expanded', String(isOpen));
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first link
      const firstLink = this.mobileNav?.querySelector('.mobile-nav-link') as HTMLElement;
      firstLink?.focus();
    } else {
      document.body.style.overflow = '';
    }
  }

  private closeMobileMenu(): void {
    this.mobileNav?.classList.remove('open');
    this.mobileNavBackdrop?.classList.remove('open');
    this.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  private handleAnchorClick(event: MouseEvent): void {
    const anchor = event.currentTarget as HTMLAnchorElement;
    const href = anchor.getAttribute('href');
    
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    
    const headerHeight = this.header?.offsetHeight || 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update URL without scrolling
    history.pushState(null, '', href);

    // Focus target for accessibility
    (target as HTMLElement).focus({ preventScroll: true });
  }

  private handleScroll(): void {
    const scrollY = window.scrollY;
    const headerHeight = this.header?.offsetHeight || 0;

    // Header shadow on scroll
    const shouldShowShadow = scrollY > 10;
    if (shouldShowShadow !== this.isScrolled) {
      this.isScrolled = shouldShowShadow;
      this.header?.classList.toggle('scrolled', this.isScrolled);
    }

    // Hide header on scroll down, show on scroll up (optional)
    // if (scrollY > headerHeight && scrollY > this.lastScrollY) {
    //   this.header?.classList.add('hidden');
    // } else {
    //   this.header?.classList.remove('hidden');
    // }

    this.lastScrollY = scrollY;
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMobileMenu();
      this.mobileMenuBtn?.focus();
    }

    // Trap focus in mobile menu
    if (event.key === 'Tab' && this.mobileNav?.classList.contains('open')) {
      const focusableElements = this.mobileNav.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  public setActiveLink(href: string): void {
    this.navLinks?.forEach((link) => {
      const isActive = link.getAttribute('href') === href;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
}

// Initialize
export const navigation = new Navigation();