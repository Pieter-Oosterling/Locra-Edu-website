/* ==========================================================================
   CodeMatch IDE Demo — Interactive code editor simulation
   ========================================================================== */

interface FileTab {
  name: string;
  language: string;
  content: string;
  modified: boolean;
}

interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  lineNumber?: { old?: number; new?: number };
}

export class CodeMatchDemo {
  private container: HTMLElement | null = null;
  private currentTab = 0;
  private tabs: FileTab[] = [];
  private isDiffView = false;
  private diffData: DiffLine[] = [];
  private animationId: number | null = null;
  private typingIndex = 0;
  private isTyping = false;

  constructor() {
    this.initTabs();
    this.init();
  }

  private initTabs(): void {
    this.tabs = [
      {
        name: 'auth.service.ts',
        language: 'typescript',
        content: `import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth';
  
  // Signals for reactive state
  private _user = signal<User | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Computed values
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        this._user.set(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }

  login(email: string, password: string) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<{ user: User; token: string }>(\`\${this.apiUrl}/login\`, { email, password })
      .pipe(
        tap(({ user, token }) => {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          this._user.set(user);
        }),
        catchError((err) => {
          this._error.set(err.error?.message || 'Inloggen mislukt');
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this._user.set(null);
  }

  // TODO: Add refresh token logic
  // TODO: Implement 2FA support
}`
        ,
        modified: false
      },
      {
        name: 'auth.guard.ts',
        language: 'typescript',
        content: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.loading().pipe(
    // Wait for loading to complete
    // Then check authentication
  );
};`,
        modified: true
      },
      {
        name: 'login.component.ts',
        language: 'typescript',
        content: `import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
      <h2>Inloggen</h2>
      
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />
        @if (form.get('email')?.invalid && form.get('email')?.touched) {
          <span class="error">Ongeldig emailadres</span>
        }
      </div>

      <div class="field">
        <label for="password">Wachtwoord</label>
        <input id="password" type="password" formControlName="password" />
        @if (form.get('password')?.invalid && form.get('password')?.touched) {
          <span class="error">Wachtwoord is verplicht</span>
        }
      </div>

      @if (auth.error()) {
        <div class="error-banner">{{ auth.error() }}</div>
      }

      <button type="submit" [disabled]="form.invalid || auth.loading()">
        @if (auth.loading()) {
          <span class="spinner"></span> Bezig...
        } @else {
          Inloggen
        }
      </button>
    </form>
  \`,
  styles: [\`
    .login-form { max-width: 400px; margin: 0 auto; padding: 2rem; }
    .field { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; }
    .error { color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem; display: block; }
    button { width: 100%; padding: 0.875rem; background: #0066cc; color: white; border: none; border-radius: 8px; font-weight: 600; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; }
  \`]
})
export class LoginComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onSubmit() {
    if (this.form.valid) {
      try {
        await this.auth.login(this.form.value.email!, this.form.value.password!).toPromise();
        this.router.navigate(['/dashboard']);
      } catch {
        // Error handled by service
      }
    }
  }
}`,
        modified: false
      }
    ];

    // Generate diff for auth.guard.ts (showing the fix)
    this.diffData = [
      { type: 'context', content: `import { inject } from '@angular/core';`, lineNumber: { old: 1, new: 1 } },
      { type: 'context', content: `import { CanActivateFn, Router } from '@angular/router';`, lineNumber: { old: 2, new: 2 } },
      { type: 'context', content: `import { AuthService } from './auth.service';`, lineNumber: { old: 3, new: 3 } },
      { type: 'context', content: `import { map, take } from 'rxjs/operators';`, lineNumber: { old: 4, new: 4 } },
      { type: 'context', content: ``, lineNumber: { old: 5, new: 5 } },
      { type: 'context', content: `export const authGuard: CanActivateFn = (route, state) => {`, lineNumber: { old: 6, new: 6 } },
      { type: 'context', content: `  const auth = inject(AuthService);`, lineNumber: { old: 7, new: 7 } },
      { type: 'context', content: `  const router = inject(Router);`, lineNumber: { old: 8, new: 8 } },
      { type: 'context', content: ``, lineNumber: { old: 9, new: 9 } },
      { type: 'remove', content: `  return auth.loading().pipe(`, lineNumber: { old: 10, new: undefined } },
      { type: 'remove', content: `    // Wait for loading to complete`, lineNumber: { old: 11, new: undefined } },
      { type: 'remove', content: `    // Then check authentication`, lineNumber: { old: 12, new: undefined } },
      { type: 'remove', content: `  );`, lineNumber: { old: 13, new: undefined } },
      { type: 'add', content: `  return auth.isAuthenticated.pipe(`, lineNumber: { old: undefined, new: 10 } },
      { type: 'add', content: `    take(1),`, lineNumber: { old: undefined, new: 11 } },
      { type: 'add', content: `    map((isAuth) => {`, lineNumber: { old: undefined, new: 12 } },
      { type: 'add', content: `      if (!isAuth) {`, lineNumber: { old: undefined, new: 13 } },
      { type: 'add', content: `        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });`, lineNumber: { old: undefined, new: 14 } },
      { type: 'add', content: `      }`, lineNumber: { old: undefined, new: 15 } },
      { type: 'add', content: `      return true;`, lineNumber: { old: undefined, new: 16 } },
      { type: 'add', content: `    })`, lineNumber: { old: undefined, new: 17 } },
      { type: 'add', content: `  );`, lineNumber: { old: undefined, new: 18 } },
      { type: 'context', content: `};`, lineNumber: { old: 14, new: 19 } }
    ];
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.render());
    } else {
      this.render();
    }
  }

  private render(): void {
    this.container = document.getElementById('codematch-ide-demo');
    if (!this.container) return;

    this.container.innerHTML = this.getIDEHTML();
    this.bindEvents();
    this.startTypingAnimation();
  }

  private getIDEHTML(): string {
    return `
      <div class="ide-window">
        <!-- Title Bar -->
        <div class="ide-titlebar">
          <div class="ide-titlebar-left">
            <div class="ide-window-controls" aria-label="Vensterbesturing">
              <button class="ide-control close" aria-label="Sluiten"></button>
              <button class="ide-control minimize" aria-label="Minimaliseren"></button>
              <button class="ide-control maximize" aria-label="Maximaliseren"></button>
            </div>
            <div class="ide-file-path" aria-label="Bestandspad">
              <svg class="ide-folder-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <path d="M2 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10-1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h10z"/>
              </svg>
              <span class="ide-path-segments">
                <span class="ide-path-seg">src</span>
                <span class="ide-separator">/</span>
                <span class="ide-path-seg">app</span>
                <span class="ide-separator">/</span>
                <span class="ide-path-seg">auth</span>
                <span class="ide-separator">/</span>
              </span>
              <span class="ide-filename active" data-tab="0">auth.service.ts</span>
              <span class="ide-separator">/</span>
              <span class="ide-filename" data-tab="1">auth.guard.ts</span>
              <span class="ide-separator">/</span>
              <span class="ide-filename" data-tab="2">login.component.ts</span>
            </div>
          </div>
          <div class="ide-titlebar-right">
            <div class="ide-tabs" role="tablist" aria-label="Open bestanden">
              ${this.tabs.map((tab, i) => `
                <button role="tab" aria-selected="${i === this.currentTab}" aria-controls="tabpanel-${i}" 
                  id="tab-${i}" class="ide-tab ${i === this.currentTab ? 'active' : ''} ${tab.modified ? 'modified' : ''}" 
                  data-tab="${i}">
                  <span class="ide-tab-name">${tab.name}</span>
                  ${tab.modified ? '<span class="ide-tab-dot" aria-label="Onopgeslagen wijzigingen"></span>' : ''}
                  <button class="ide-tab-close" aria-label="Sluit ${tab.name}" data-tab="${i}">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                </button>
              `).join('')}
            </div>
            <div class="ide-actions">
              <button class="ide-btn ide-btn-ghost" id="btn-split" aria-label="Split editor" title="Split editor">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                </svg>
              </button>
              <button class="ide-btn ide-btn-ghost" id="btn-diff" aria-label="${this.isDiffView ? 'Verberg diff' : 'Toon diff'}" title="${this.isDiffView ? 'Verberg diff' : 'Toon diff'}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9M12 4h9M12 12h9M3 4v16"/>
                </svg>
              </button>
              <button class="ide-btn ide-btn-primary" id="btn-apply" aria-label="Pas wijzigingen toe" title="Pas wijzigingen toe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Toepassen
              </button>
            </div>
          </div>
        </div>

        <!-- Editor Area -->
        <div class="ide-editor-area">
          <!-- File Explorer Sidebar -->
          <aside class="ide-sidebar" aria-label="Bestandenverkenner">
            <div class="ide-sidebar-header">
              <span class="ide-sidebar-title">VERKENNER</span>
              <button class="ide-sidebar-action" aria-label="Nieuw bestand">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
            <ul class="ide-file-tree" role="tree" aria-label="Projectbestanden">
              <li class="ide-file-tree-item expanded" role="treeitem" aria-expanded="true">
                <span class="ide-file-tree-toggle" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
                <svg class="ide-file-icon folder" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                  <path d="M2 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10-1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h10z"/>
                </svg>
                <span>src</span>
              </li>
              <li class="ide-file-tree-item" role="treeitem" aria-expanded="false">
                <span class="ide-file-tree-toggle" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
                <svg class="ide-file-icon folder" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                  <path d="M2 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10-1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h10z"/>
                </svg>
                <span>app</span>
                <ul class="ide-file-tree-children" role="group">
                  <li class="ide-file-tree-item" role="treeitem">
                    <span class="ide-file-tree-toggle"></span>
                    <svg class="ide-file-icon folder" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                      <path d="M2 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10-1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h10z"/>
                    </svg>
                    <span>auth</span>
                    <ul class="ide-file-tree-children" role="group">
                      ${this.tabs.map((tab, i) => `
                        <li class="ide-file-tree-item ${i === this.currentTab ? 'active' : ''}" role="treeitem" data-tab="${i}">
                          <span class="ide-file-tree-toggle"></span>
                          <svg class="ide-file-icon file ts" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                            <path d="M14 2H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V8l-6-6z"/>
                          </svg>
                          <span>${tab.name}</span>
                          ${tab.modified ? '<span class="ide-file-modified" aria-label="Onopgeslagen"></span>' : ''}
                        </li>
                      `).join('')}
                    </ul>
                  </li>
                  <li class="ide-file-tree-item" role="treeitem">
                    <span class="ide-file-tree-toggle"></span>
                    <svg class="ide-file-icon folder" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                      <path d="M2 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10-1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h10z"/>
                    </svg>
                    <span>shared</span>
                  </li>
                </ul>
              </li>
              <li class="ide-file-tree-item" role="treeitem">
                <span class="ide-file-tree-toggle"></span>
                <svg class="ide-file-icon file json" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                  <path d="M14 2H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V8l-6-6z"/>
                </svg>
                <span>package.json</span>
              </li>
              <li class="ide-file-tree-item" role="treeitem">
                <span class="ide-file-tree-toggle"></span>
                <svg class="ide-file-icon file md" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
                  <path d="M14 2H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V8l-6-6z"/>
                </svg>
                <span>README.md</span>
              </li>
            </ul>
          </aside>

          <!-- Main Editor -->
          <main class="ide-main" role="main">
            ${this.isDiffView ? this.getDiffViewHTML() : this.getEditorViewHTML()}
          </main>

          <!-- AI Chat Panel -->
          <aside class="ide-ai-panel" aria-label="AI Assistent">
            <div class="ide-ai-header">
              <div class="ide-ai-avatar" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <div class="ide-ai-info">
                <span class="ide-ai-name">CodeMatch AI</span>
                <span class="ide-ai-status thinking" id="ai-status">
                  <span class="status-dot"></span>
                  <span>Denkt na...</span>
                </span>
              </div>
              <button class="ide-ai-action" id="btn-clear-chat" aria-label="Wis chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
            <div class="ide-ai-messages" id="ai-messages" role="log" aria-live="polite">
              <div class="ai-message ai-message-assistant">
                <div class="ai-message-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <div class="ai-message-content">
                  <p>Hallo! Ik zie dat je werkt aan de <code>auth.guard.ts</code>. De implementatie is nog incompleet — de guard wacht oneindig op <code>auth.loading()</code> maar checked nooit daadwerkelijk of de gebruiker ingelogd is.</p>
                  <p>Wil je dat ik de guard afmaak met de juiste logica?</p>
                </div>
              </div>
              <div class="ai-message ai-message-user">
                <div class="ai-message-content">
                  <p>Ja, maak de guard af en toon me de diff voordat je het toepast.</p>
                </div>
              </div>
              <div class="ai-message ai-message-assistant">
                <div class="ai-message-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <div class="ai-message-content">
                  <p>Perfect. Ik heb een plan opgesteld:</p>
                  <ol>
                    <li>Gebruik <code>auth.isAuthenticated</code> (computed signal) in plaats van <code>auth.loading()</code></li>
                    <li>Voeg <code>take(1)</code> toe om te voorkomen dat de guard oneindig blijft luisteren</li>
                    <li>Redirect naar login met <code>returnUrl</code> voor betere UX</li>
                  </ol>
                  <p>Hier is de diff:</p>
                </div>
              </div>
            </div>
            <div class="ide-ai-input">
              <textarea id="ai-input" placeholder="Vraag CodeMatch om code te schrijven, uitleggen of te refactoreren..." aria-label="AI chat input" rows="2"></textarea>
              <div class="ide-ai-input-actions">
                <button class="ide-btn ide-btn-ghost" id="btn-teach-mode" aria-label="Teach Me modus" title="Teach Me modus">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Teach Me
                </button>
                <button class="ide-btn ide-btn-ghost" id="btn-plan-mode" aria-label="Plan modus" title="Plan modus">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="9" y1="11" x2="3" y2="11"/>
                    <line x1="9" y1="7" x2="3" y2="7"/>
                    <line x1="15" y1="15" x2="9" y2="15"/>
                    <line x1="15" y1="19" x2="9" y2="19"/>
                    <line x1="21" y1="3" x2="21" y2="19"/>
                  </svg>
                  Plan
                </button>
                <button class="ide-btn ide-btn-primary" id="btn-send" aria-label="Verstuur">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>

        <!-- Status Bar -->
        <div class="ide-statusbar">
          <div class="ide-status-left">
            <span class="ide-status-item" id="status-line-col">Ln 1, Col 1</span>
            <span class="ide-status-item" id="status-encoding">UTF-8</span>
            <span class="ide-status-item" id="status-eol">LF</span>
          </div>
          <div class="ide-status-center">
            <span class="ide-status-item">TypeScript</span>
            <span class="ide-status-item" id="status-errors">0 fouten</span>
            <span class="ide-status-item" id="status-warnings">2 waarschuwingen</span>
          </div>
          <div class="ide-status-right">
            <span class="ide-status-item" id="status-sync">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              Gesynchroniseerd
            </span>
            <span class="ide-status-item">Hoofd</span>
          </div>
        </div>
      </div>
    `;
  }

  private getEditorViewHTML(): string {
    const tab = this.tabs[this.currentTab];
    const lines = tab.content.split('\n');
    
    return `
      <div class="ide-editor" data-language="${tab.language}">
        <div class="ide-editor-gutter" aria-hidden="true">
          ${lines.map((_, i) => `<span class="ide-line-number" data-line="${i + 1}">${i + 1}</span>`).join('')}
        </div>
        <div class="ide-editor-content" role="textbox" aria-multiline="true" aria-label="Code editor">
          <pre class="ide-code"><code>${this.highlightCode(tab.content, tab.language)}</code></pre>
        </div>
        <div class="ide-minimap" aria-hidden="true"></div>
      </div>
    `;
  }

  private getDiffViewHTML(): string {
    return `
      <div class="ide-diff-view" role="region" aria-label="Diff weergave voor auth.guard.ts">
        <div class="ide-diff-header">
          <div class="ide-diff-file-info">
            <span class="ide-diff-file-label">Wijzigingen in</span>
            <span class="ide-diff-filename">auth.guard.ts</span>
          </div>
          <div class="ide-diff-stats">
            <span class="ide-diff-stat add">+${this.diffData.filter(d => d.type === 'add').length}</span>
            <span class="ide-diff-stat remove">-${this.diffData.filter(d => d.type === 'remove').length}</span>
          </div>
        </div>
        <div class="ide-diff-content">
          <div class="ide-diff-gutter-old" aria-hidden="true">
            ${this.diffData.map((line, i) => `
              <span class="ide-diff-line-num ${line.type}" data-line="${i}">
                ${line.lineNumber?.old ?? ''}
              </span>
            `).join('')}
          </div>
          <div class="ide-diff-gutter-new" aria-hidden="true">
            ${this.diffData.map((line, i) => `
              <span class="ide-diff-line-num ${line.type}" data-line="${i}">
                ${line.lineNumber?.new ?? ''}
              </span>
            `).join('')}
          </div>
          <div class="ide-diff-lines" role="list" aria-label="Diff regels">
            ${this.diffData.map((line, i) => `
              <div class="ide-diff-line ${line.type}" role="listitem" data-line="${i}">
                <div class="ide-diff-line-content">
                  <span class="ide-diff-marker" aria-hidden="true">
                    ${line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
                  </span>
                  <span class="ide-diff-code">${this.escapeHtml(line.content) || '&#8203;'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="ide-diff-actions">
          <button class="btn btn-secondary btn-sm" id="btn-diff-prev" aria-label="Vorige wijziging">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Vorige
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-diff-next" aria-label="Volgende wijziging">
            Volgende
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="btn btn-primary btn-sm" id="btn-diff-apply" aria-label="Pas deze diff toe">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Wijzigingen toepassen
          </button>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    if (!this.container) return;

    // Tab switching
    this.container.querySelectorAll('.ide-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.ide-tab-close')) return;
        const tabIndex = parseInt((tab as HTMLElement).dataset.tab || '0', 10);
        this.switchTab(tabIndex);
      });
    });

    // Close tab
    this.container.querySelectorAll('.ide-tab-close').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tabIndex = parseInt((btn as HTMLElement).dataset.tab || '0', 10);
        this.closeTab(tabIndex);
      });
    });

    // File tree clicks
    this.container.querySelectorAll('.ide-file-tree-item[data-tab]').forEach((item) => {
      item.addEventListener('click', () => {
        const tabIndex = parseInt(item.dataset.tab || '0', 10);
        this.switchTab(tabIndex);
      });
    });

    // Diff toggle
    this.container.querySelector('#btn-diff')?.addEventListener('click', () => this.toggleDiffView());

    // Diff navigation
    this.container.querySelector('#btn-diff-prev')?.addEventListener('click', () => this.navigateDiff(-1));
    this.container.querySelector('#btn-diff-next')?.addEventListener('click', () => this.navigateDiff(1));
    this.container.querySelector('#btn-diff-apply')?.addEventListener('click', () => this.applyDiff());

    // Apply button in editor view
    this.container.querySelector('#btn-apply')?.addEventListener('click', () => this.applyChanges());

    // AI Chat actions
    this.container.querySelector('#btn-teach-mode')?.addEventListener('click', () => this.activateTeachMode());
    this.container.querySelector('#btn-plan-mode')?.addEventListener('click', () => this.activatePlanMode());
    this.container.querySelector('#btn-send')?.addEventListener('click', () => this.sendAIMessage());
    this.container.querySelector('#ai-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendAIMessage();
      }
    });
  }

  private switchTab(index: number): void {
    if (index < 0 || index >= this.tabs.length) return;
    this.currentTab = index;
    this.render();
  }

  private closeTab(index: number): void {
    if (this.tabs.length <= 1) return;
    this.tabs.splice(index, 1);
    if (this.currentTab >= this.tabs.length) {
      this.currentTab = this.tabs.length - 1;
    }
    this.render();
  }

  private toggleDiffView(): void {
    this.isDiffView = !this.isDiffView;
    this.render();
  }

  private navigateDiff(direction: number): void {
    const lines = this.container?.querySelectorAll('.ide-diff-line');
    if (!lines?.length) return;

    let currentIndex = -1;
    lines.forEach((line, i) => {
      if (line.classList.contains('focused')) currentIndex = i;
    });

    const nextIndex = Math.max(0, Math.min(lines.length - 1, currentIndex + direction));
    lines.forEach((line) => line.classList.remove('focused'));
    (lines[nextIndex] as HTMLElement)?.classList.add('focused');
    (lines[nextIndex] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private applyDiff(): void {
    // Simulate applying the diff
    this.showToast('Wijzigingen toegepast op auth.guard.ts', 'success');
    this.isDiffView = false;
    // Update the tab content
    this.tabs[1].content = `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated.pipe(
    take(1),
    map((isAuth) => {
      if (!isAuth) {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
      return true;
    })
  );
};`;
    this.tabs[1].modified = false;
    this.render();
  }

  private applyChanges(): void {
    this.showToast('Bestand opgeslagen', 'success');
    this.tabs[this.currentTab].modified = false;
    this.render();
  }

  private startTypingAnimation(): void {
    // Animate AI status
    const statusEl = this.container?.querySelector('#ai-status');
    if (!statusEl) return;

    const states = [
      { text: 'Denkt na...', class: 'thinking' },
      { text: 'Analyseert codebase...', class: 'thinking' },
      { text: 'Zoekt context...', class: 'thinking' },
      { text: 'Klaar om te helpen', class: 'ready' }
    ];

    let stateIndex = 0;
    const cycle = () => {
      if (!this.container) return;
      const statusEl = this.container.querySelector('#ai-status');
      if (!statusEl) return;

      const state = states[stateIndex];
      statusEl.className = `ide-ai-status ${state.class}`;
      statusEl.querySelector('span:last-child')!.textContent = state.text;
      
      stateIndex = (stateIndex + 1) % states.length;
      this.animationId = window.setTimeout(cycle, 3000);
    };

    cycle();
  }

  private activateTeachMode(): void {
    this.showToast('Teach Me modus geactiveerd — AI legt nu concepten uit', 'info');
    // Switch to teach mode tab
    const teachTab = document.getElementById('tab-teach') as HTMLButtonElement;
    teachTab?.click();
  }

  private activatePlanMode(): void {
    this.showToast('Plan modus geactiveerd — AI maakt een stappenplan', 'info');
    const planTab = document.getElementById('tab-plan') as HTMLButtonElement;
    planTab?.click();
  }

  private sendAIMessage(): void {
    const input = this.container?.querySelector('#ai-input') as HTMLTextAreaElement;
    if (!input || !input.value.trim()) return;

    const message = input.value.trim();
    input.value = '';
    input.style.height = 'auto';

    // Add user message
    this.addAIMessage(message, 'user');

    // Simulate AI response
    setTimeout(() => {
      this.addAIMessage(this.generateAIResponse(message), 'assistant');
    }, 1000);
  }

  private addAIMessage(content: string, role: 'user' | 'assistant'): void {
    const messagesContainer = this.container?.querySelector('#ai-messages');
    if (!messagesContainer) return;

    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ai-message-${role}`;
    messageEl.innerHTML = role === 'assistant' ? `
      <div class="ai-message-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
        </svg>
      </div>
      <div class="ai-message-content">${this.formatAIMessage(content)}</div>
    ` : `
      <div class="ai-message-content">${this.formatAIMessage(content)}</div>
    `;

    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  private formatAIMessage(content: string): string {
    // Simple markdown-like formatting
    return content
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  private generateAIResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    
    if (lower.includes('useMemo') || lower.includes('usememo')) {
      return `Goede vraag! \`useMemo\` wordt gebruikt om **dure berekeningen te memoïsiren** zodat ze niet bij elke render opnieuw worden uitgevoerd.

**Wanneer gebruik je het?**
- Dure berekeningen (filteren/sorteren van grote arrays)
- Referentie-egaliteit behouden voor child components
- Vermijden van herberekening afgeleide state

**Voorbeeld:**
\`\`\`tsx
const sortedUsers = useMemo(() => 
  users
    .filter(u => u.active)
    .sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);
\`\`\`

**Let op:** Gebruik het niet overal — de overhead van de hook zelf kan duurder zijn dan de berekening!`;
    }

    if (lower.includes('waarom') || lower.includes('why')) {
      return `Ik help je graag de "waarom" te begrijpen! Wat specifiek wil je weten? Bijvoorbeeld:
- Waarom deze hook/pattern?
- Waarom deze TypeScript typing?
- Waarom deze architectuurkeuze?

Stel je vraag en ik leg het stap voor stap uit.`;
    }

    return `Ik begrijp je vraag over "${userMessage}". Als CodeMatch AI zou ik je helpen met:
- Code uitleggen in platte taal
- Alternatieven voorstellen met voor- en nadelen
- Best practices tonen voor jouw stack
- Diffs genereren voor wijzigingen

Wat wil je precies bereiken?`;
  }

  private highlightCode(code: string, language: string): string {
    // Simple syntax highlighting for demo
    return this.escapeHtml(code)
      .replace(/\b(import|export|const|let|var|function|return|if|else|for|while|class|interface|type|async|await|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|readonly|static|abstract|get|set)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(string|number|boolean|void|any|unknown|never|null|undefined|object|Array|Promise|Map|Set)\b/g, '<span class="type">$1</span>')
      .replace(/\b(true|false)\b/g, '<span class="const">$1</span>')
      .replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, '<span class="str">$1</span>')
      .replace(/(`[^`]*`)/g, '<span class="str">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      .replace(/(@\w+)/g, '<span class="dec">$1</span>')
      .replace(/(\d+\.?\d*)/g, '<span class="num">$1</span>');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    // Simple toast - in production use a proper toast library
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : 
          type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
          '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
      </svg>
      <div class="toast-content">
        <div class="toast-title">${type === 'success' ? 'Succes' : type === 'error' ? 'Fout' : 'Info'}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Sluiten">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    container.appendChild(toast);

    toast.querySelector('.toast-close')?.addEventListener('click', () => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 200);
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 200);
      }
    }, 5000);
  }

  public destroy(): void {
    if (this.animationId) {
      clearTimeout(this.animationId);
    }
  }
}