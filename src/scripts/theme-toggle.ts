/* ==========================================================================
   Theme Toggle — Dark/Light mode with persistence
   ========================================================================== */

type Theme = 'light' | 'dark' | 'system';

export class ThemeToggle {
  private toggle: HTMLButtonElement | null = null;
  private mediaQuery: MediaQueryList;
  private currentTheme: Theme = 'system';
  private storageKey = 'locra-theme';

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  private init(): void {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    this.toggle = document.querySelector('.theme-toggle');
    if (!this.toggle) return;

    // Load saved theme
    this.loadTheme();

    // Apply initial theme
    this.applyTheme(this.currentTheme);

    // Event listeners
    this.toggle.addEventListener('click', () => this.cycleTheme());
    this.mediaQuery.addEventListener('change', () => this.onSystemThemeChange());

    // Keyboard support
    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.cycleTheme();
      }
    });
  }

  private loadTheme(): void {
    try {
      const saved = localStorage.getItem(this.storageKey) as Theme | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        this.currentTheme = saved;
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveTheme(): void {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch {
      // Ignore storage errors
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    let resolvedTheme: 'light' | 'dark';

    if (theme === 'system') {
      resolvedTheme = this.mediaQuery.matches ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }

    root.setAttribute('data-theme', resolvedTheme);
    
    // Update meta theme-color
    this.updateMetaThemeColor(resolvedTheme);
  }

  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    let meta = document.querySelector('meta[name="theme-color"][media]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? '#0A84FF' : '#0066CC');
    meta.setAttribute('media', theme === 'dark' ? '(prefers-color-scheme: dark)' : '(prefers-color-scheme: light)');
  }

  private cycleTheme(): void {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];
    
    this.saveTheme();
    this.applyTheme(this.currentTheme);
    this.updateToggleAriaLabel();
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: this.currentTheme, resolved: document.documentElement.getAttribute('data-theme') }
    }));
  }

  private onSystemThemeChange(): void {
    if (this.currentTheme === 'system') {
      this.applyTheme('system');
    }
    this.updateToggleAriaLabel();
  }

  private updateToggleAriaLabel(): void {
    if (!this.toggle) return;
    
    const labels: Record<Theme, string> = {
      light: 'Schakel naar donkere modus',
      dark: 'Schakel naar systeemvoorkeur',
      system: 'Schakel naar lichte modus'
    };
    
    this.toggle.setAttribute('aria-label', labels[this.currentTheme]);
  }

  public getTheme(): Theme {
    return this.currentTheme;
  }

  public getResolvedTheme(): 'light' | 'dark' {
    return document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
  }

  public setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.saveTheme();
    this.applyTheme(theme);
    this.updateToggleAriaLabel();
  }
}

// Initialize
export const themeToggle = new ThemeToggle();