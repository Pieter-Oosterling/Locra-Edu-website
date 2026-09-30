/* ==========================================================================
   Plan Mode Demo — Interactive task planning with approval steps
   ========================================================================== */

interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'done' | 'skipped';
  files: string[];
  estimatedTime: string;
  codePreview?: string;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  steps: PlanStep[];
  createdAt: Date;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
}

export class PlanModeDemo {
  private container: HTMLElement | null = null;
  private plan: Plan;
  private currentStepIndex = 0;
  private isAnimating = false;

  constructor() {
    this.plan = this.createSamplePlan();
    this.init();
  }

  private createSamplePlan(): Plan {
    return {
      id: 'plan-auth-refactor',
      title: 'Auth Guard implementeren met Signals',
      description: 'Vervang de onvolledige auth.guard.ts door een werkende implementatie die Angular Signals gebruikt voor reactieve authenticatie state.',
      status: 'active',
      createdAt: new Date(),
      steps: [
        {
          id: 'step-1',
          title: 'Analyseer huidige code',
          description: 'Bekijk de bestaande auth.guard.ts en identificeer wat er ontbreekt (loading state wordt niet correct afgehandeld).',
          status: 'done',
          files: ['src/app/auth/auth.guard.ts'],
          estimatedTime: '1 min',
          codePreview: `// Huidige code (incompleet):
return auth.loading().pipe(
  // Wait for loading to complete
  // Then check authentication
);`
        },
        {
          id: 'step-2',
          title: 'Implementeer isAuthenticated signal',
          description: 'Voeg een computed signal toe aan AuthService die reactief blijft bij auth state wijzigingen.',
          status: 'done',
          files: ['src/app/auth/auth.service.ts'],
          estimatedTime: '2 min',
          codePreview: `// In AuthService:
readonly isAuthenticated = computed(() => !!this._user());`
        },
        {
          id: 'step-3',
          title: 'Herschrijf authGuard met take(1)',
          description: 'Gebruik de nieuwe isAuthenticated signal met take(1) om oneindige subscriptions te voorkomen.',
          status: 'in-progress',
          files: ['src/app/auth/auth.guard.ts'],
          estimatedTime: '3 min',
          codePreview: `export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated.pipe(
    take(1),
    map((isAuth) => {
      if (!isAuth) {
        return router.createUrlTree(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
      }
      return true;
    })
  );
};`
        },
        {
          id: 'step-4',
          title: 'Voeg unit tests toe',
          description: 'Schrijf tests voor de guard: authenticated user, unauthenticated redirect, loading state.',
          status: 'pending',
          files: ['src/app/auth/auth.guard.spec.ts'],
          estimatedTime: '5 min'
        },
        {
          id: 'step-5',
          title: 'Update documentatie',
          description: 'Documenteer de nieuwe guard API en gebruiksvorschriften in README.',
          status: 'pending',
          files: ['docs/auth-guard.md'],
          estimatedTime: '2 min'
        }
      ]
    };
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.render());
    } else {
      this.render();
    }
  }

  private render(): void {
    this.container = document.getElementById('plan-mode-demo');
    if (!this.container) return;

    this.container.innerHTML = this.getPlanHTML();
    this.bindEvents();
    this.animateProgress();
  }

  private getPlanHTML(): string {
    const completedSteps = this.plan.steps.filter(s => s.status === 'done').length;
    const totalSteps = this.plan.steps.length;
    const progress = (completedSteps / totalSteps) * 100;

    return `
      <div class="plan-viewer">
        <!-- Plan Header -->
        <div class="plan-header">
          <div class="plan-meta">
            <span class="plan-badge status-${this.plan.status}">${this.formatStatus(this.plan.status)}</span>
            <span class="plan-progress">${completedSteps} / ${totalSteps} stappen voltooid</span>
          </div>
          <h3 class="plan-title">${this.plan.title}</h3>
          <p class="plan-description">${this.plan.description}</p>
          
          <div class="plan-progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Plan voortgang">
            <div class="plan-progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>

        <!-- Steps List -->
        <div class="plan-steps" role="list" aria-label="Plan stappen">
          ${this.plan.steps.map((step, index) => this.renderStep(step, index)).join('')}
        </div>

        <!-- Current Step Detail -->
        <div class="plan-detail" id="plan-detail">
          ${this.renderStepDetail(this.plan.steps[this.currentStepIndex])}
        </div>

        <!-- Plan Actions -->
        <div class="plan-actions">
          <button class="btn btn-secondary" id="plan-prev" aria-label="Vorige stap" ${this.currentStepIndex === 0 ? 'disabled' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Vorige
          </button>
          <div class="plan-step-indicator">
            Stap ${this.currentStepIndex + 1} van ${this.plan.steps.length}
          </div>
          <button class="btn btn-primary" id="plan-next" aria-label="Volgende stap" ${this.currentStepIndex === this.plan.steps.length - 1 ? 'disabled' : ''}>
            Volgende
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- Plan Controls -->
        <div class="plan-controls">
          <button class="btn btn-ghost btn-sm" id="plan-add-step">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Stap toevoegen
          </button>
          <button class="btn btn-ghost btn-sm" id="plan-save">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Plan opslaan
          </button>
          <button class="btn btn-primary btn-sm" id="plan-execute">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Plan uitvoeren
          </button>
        </div>
      </div>
    `;
  }

  private renderStep(step: PlanStep, index: number): string {
    const isCurrent = index === this.currentStepIndex;
    const statusIcons: Record<PlanStep['status'], string> = {
      pending: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
      'in-progress': '<div class="step-spinner" aria-hidden="true"></div>',
      done: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
      skipped: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    };

    return `
      <div class="plan-step ${step.status} ${isCurrent ? 'current' : ''}" role="listitem" data-step="${index}" data-status="${step.status}">
        <div class="plan-step-marker" aria-hidden="true">
          ${statusIcons[step.status]}
        </div>
        <div class="plan-step-content">
          <div class="plan-step-header">
            <span class="plan-step-number">${index + 1}</span>
            <h4 class="plan-step-title">${step.title}</h4>
            <span class="plan-step-time">${step.estimatedTime}</span>
          </div>
          <p class="plan-step-description">${step.description}</p>
          <div class="plan-step-files">
            ${step.files.map(f => `<span class="plan-file-tag">${this.escapeHtml(f)}</span>`).join('')}
          </div>
        </div>
        <div class="plan-step-actions">
          ${step.status === 'pending' ? `
            <button class="btn btn-ghost btn-sm plan-step-approve" data-step="${index}" aria-label="Goedkeuren en uitvoeren">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Goedkeuren
            </button>
          ` : step.status === 'in-progress' ? `
            <button class="btn btn-ghost btn-sm plan-step-pause" data-step="${index}" aria-label="Pauzeren">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
              Pauzeren
            </button>
          ` : step.status === 'done' ? `
            <span class="plan-step-done" aria-label="Voltooid">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Voltooid
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderStepDetail(step: PlanStep): string {
    if (!step) return '';

    return `
      <div class="plan-detail-card">
        <div class="plan-detail-header">
          <span class="plan-detail-badge status-${step.status}">${this.formatStatus(step.status)}</span>
          <h4 class="plan-detail-title">${step.title}</h4>
        </div>
        <p class="plan-detail-description">${step.description}</p>
        
        ${step.codePreview ? `
          <div class="plan-detail-preview">
            <div class="plan-preview-header">
              <span class="plan-preview-title">Code Preview</span>
              <span class="plan-preview-lang">TypeScript</span>
            </div>
            <pre class="plan-preview-code"><code>${this.highlightCode(this.escapeHtml(step.codePreview))}</code></pre>
          </div>
        ` : ''}

        <div class="plan-detail-files">
          <strong>Betrokken bestanden:</strong>
          <ul>
            ${step.files.map(f => `<li>${this.escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>

        <div class="plan-detail-meta">
          <span><strong>Geschatte tijd:</strong> ${step.estimatedTime}</span>
          <span><strong>Status:</strong> ${this.formatStatus(step.status)}</span>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    if (!this.container) return;

    // Step click
    this.container.querySelectorAll('.plan-step').forEach((stepEl) => {
      stepEl.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.plan-step-approve, .plan-step-pause')) return;
        const stepIndex = parseInt(stepEl.getAttribute('data-step') || '0', 10);
        this.selectStep(stepIndex);
      });

      // Approve button
      stepEl.querySelector('.plan-step-approve')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const stepIndex = parseInt((e.currentTarget as HTMLElement).dataset.step || '0', 10);
        this.approveStep(stepIndex);
      });

      // Pause button
      stepEl.querySelector('.plan-step-pause')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const stepIndex = parseInt((e.currentTarget as HTMLElement).dataset.step || '0', 10);
        this.pauseStep(stepIndex);
      });
    });

    // Navigation
    this.container.querySelector('#plan-prev')?.addEventListener('click', () => this.selectStep(this.currentStepIndex - 1));
    this.container.querySelector('#plan-next')?.addEventListener('click', () => this.selectStep(this.currentStepIndex + 1));

    // Controls
    this.container.querySelector('#plan-add-step')?.addEventListener('click', () => this.addStep());
    this.container.querySelector('#plan-save')?.addEventListener('click', () => this.savePlan());
    this.container.querySelector('#plan-execute')?.addEventListener('click', () => this.executePlan());
  }

  private selectStep(index: number): void {
    if (index < 0 || index >= this.plan.steps.length || this.isAnimating) return;
    this.currentStepIndex = index;
    this.updateStepDetail();
    this.updateNavigation();
  }

  private updateStepDetail(): void {
    const detailContainer = this.container?.querySelector('#plan-detail');
    if (!detailContainer) return;
    
    detailContainer.style.opacity = '0';
    detailContainer.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      detailContainer.innerHTML = this.renderStepDetail(this.plan.steps[this.currentStepIndex]);
      detailContainer.style.opacity = '1';
      detailContainer.style.transform = 'translateY(0)';
    }, 150);
  }

  private updateNavigation(): void {
    const prevBtn = this.container?.querySelector('#plan-prev') as HTMLButtonElement;
    const nextBtn = this.container?.querySelector('#plan-next') as HTMLButtonElement;
    const indicator = this.container?.querySelector('.plan-step-indicator');

    if (prevBtn) prevBtn.disabled = this.currentStepIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentStepIndex === this.plan.steps.length - 1;
    if (indicator) indicator.textContent = `Stap ${this.currentStepIndex + 1} van ${this.plan.steps.length}`;

    // Update step list active state
    this.container?.querySelectorAll('.plan-step').forEach((el, i) => {
      el.classList.toggle('current', i === this.currentStepIndex);
    });
  }

  private approveStep(index: number): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const step = this.plan.steps[index];
    step.status = 'in-progress';
    this.renderStepInPlace(index);
