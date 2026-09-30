/* ==========================================================================
   Thinking Status Demo — Shows AI reasoning process
   ========================================================================== */

interface ThinkingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'done';
  duration?: number;
  details?: string[];
}

export class ThinkingStatusDemo {
  private container: HTMLElement | null = null;
  private steps: ThinkingStep[] = [];
  private currentStep = 0;
  private isRunning = false;
  private animationId: number | null = null;
  private stepStartTime = 0;

  constructor() {
    this.initSteps();
    this.init();
  }

  private initSteps(): void {
    this.steps = [
      {
        id: 'analyze-request',
        title: 'Aanvraag analyseren',
        description: 'Begrijpen wat de gebruiker wil bereiken',
        status: 'pending',
        duration: 800,
        details: ['Intent classificeren', 'Context verzamelen', 'Constraints identificeren']
      },
      {
        id: 'search-context',
        title: 'Context zoeken',
        description: 'Relevante bestanden en code zoeken in de codebase',
        status: 'pending',
        duration: 1200,
        details: ['Bestanden indexeren', 'Semantisch zoeken', 'Relevante snippets selecteren']
      },
      {
        id: 'plan-solution',
        title: 'Oplossing plannen',
        description: 'Stappenplan opstellen voor de implementatie',
        status: 'pending',
        duration: 1000,
        details: ['Architectuur bepalen', 'Dependencies checken', 'Risico\'s evalueren']
      },
      {
        id: 'generate-code',
        title: 'Code genereren',
        description: 'De daadwerkelijke code schrijven met best practices',
        status: 'pending',
        duration: 1500,
        details: ['Typescript typen', 'Error handling', 'Testing overwegen']
      },
      {
        id: 'review-validate',
        title: 'Review & valideren',
        description: 'Code controleren op correctheid en consistentie',
        status: 'pending',
        duration: 600,
        details: ['Syntax check', 'Type check', 'Style guide compliance']
      },
      {
        id: 'present-result',
        title: 'Resultaat presenteren',
        description: 'Diff voorbereiden en uitleg genereren',
        status: 'pending',
        duration: 400,
        details: ['Diff formatteren', 'Uitleg schrijven', 'Acties voorbereiden']
      }
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
    this.container = document.getElementById('thinking-status-demo');
    if (!this.container) return;

    this.container.innerHTML = this.getThinkingHTML();
    this.bindEvents();
  }

  private getThinkingHTML(): string {
    const completedSteps = this.steps.filter(s => s.status === 'done').length;
    const totalSteps = this.steps.length;
    const overallProgress = (completedSteps / totalSteps) * 100;

    return `
      <div class="thinking-viewer">
        <!-- Header -->
        <div class="thinking-header">
          <div class="thinking-avatar thinking">
            <div class="thinking-spinner" aria-hidden="true">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <svg class="thinking-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
            </svg>
          </div>
          <div class="thinking-header-info">
            <h3 class="thinking-title">CodeMatch denkt na...</h3>
            <p class="thinking-subtitle">${this.getCurrentStatusText()}</p>
          </div>
          <div class="thinking-overall-progress">
            <div class="thinking-progress-ring" style="--progress: ${overallProgress}%">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle class="progress-bg" cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="4"/>
                <circle class="progress-fill" cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" style="stroke-dasharray: 125.66; stroke-dashoffset: ${125.66 * (1 - overallProgress / 100)};"/>
              </svg>
              <span class="thinking-progress-percent">${Math.round(overallProgress)}%</span>
            </div>
          </div>
        </div>

        <!-- Steps Timeline -->
        <div class="thinking-timeline" role="list" aria-label="Denkstappen">
          ${this.steps.map((step, index) => this.renderStep(step, index)).join('')}
        </div>

        <!-- Live Log -->
        <div class="thinking-log" aria-live="polite" aria-label="Live denken logboek">
          <div class="thinking-log-header">
            <span class="thinking-log-title">Live reasoning</span>
            <span class="thinking-log-status">${this.isRunning ? 'Actief' : this.isComplete() ? 'Voltooid' : 'Klaar om te starten'}</span>
          </div>
          <div class="thinking-log-content" id="thinking-log">
            ${this.renderLogEntries()}
          </div>
        </div>

        <!-- Controls -->
        <div class="thinking-controls">
          <button class="btn btn-primary btn-large" id="thinking-start" ${this.isRunning || this.isComplete() ? 'disabled' : ''}>
            ${this.isRunning ? `
              <span class="btn-spinner" aria-hidden="true"></span>
              ${this.getCurrentStep()?.title || 'Bezig...'}
            ` : this.isComplete() ? 'Voltooid' : 'Start denken'}
            ${!this.isRunning && !this.isComplete() ? `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            ` : ''}
          </button>
          
          ${this.isComplete() ? `
            <button class="btn btn-secondary" id="thinking-reset">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6"/>
                <path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Opnieuw
            </button>
          ` : ''}

          <button class="btn btn-ghost" id="thinking-skip" ${this.isRunning ? '' : 'disabled'}>
            Over slaan
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 19 22 12 13 5 13 19"/>
              <polygon points="2 19 11 12 2 5 2 19"/>
            </svg>
          </button>
        </div>

        <!-- Result Preview (when complete) -->
        ${this.isComplete() ? `
          <div class="thinking-result" data-animate="slide-up">
            <div class="thinking-result-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="16 11 12 15 8 11"/>
              </svg>
              <div>
                <h4>Klaar om te helpen!</h4>
                <p>Ik heb een oplossing gevonden. Wil je de diff zien?</p>
              </div>
            </div>
            <div class="thinking-result-actions">
              <button class="btn btn-primary" id="thinking-show-diff">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9M12 4h9M12 12h9M3 4v16"/>
                </svg>
                Toon diff
              </button>
              <button class="btn btn-secondary" id="thinking-apply-direct">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Direct toepassen
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderStep(step: ThinkingStep, index: number): string {
    const isCurrent = index === this.currentStep && this.isRunning;
    const isDone = step.status === 'done';
    const isActive = step.status === 'active';

    const statusIcon = isDone ? `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ` : isActive ? `
      <div class="thinking-step-spinner" aria-hidden="true"></div>
    ` : `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    `;

    const stepProgress = isDone ? 100 : isActive ? this.getStepProgress() : 0;

    return `
      <div class="thinking-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}" role="listitem" data-step="${index}">
        <div class="thinking-step-marker" style="--progress: ${stepProgress}%">
          <div class="thinking-step-circle">
            ${statusIcon}
          </div>
          <div class="thinking-step-line" aria-hidden="true"></div>
        </div>
        <div class="thinking-step-content">
          <div class="thinking-step-header">
            <span class="thinking-step-number">${index + 1}</span>
            <h4 class="thinking-step-title">${step.title}</h4>
            ${step.duration ? `<span class="thinking-step-duration">${(step.duration / 1000).toFixed(1)}s</span>` : ''}
          </div>
          <p class="thinking-step-description">${step.description}</p>
          ${step.details ? `
            <ul class="thinking-step-details">
              ${step.details.map(d => `<li>${d}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderLogEntries(): string {
    if (!this.isRunning && !this.isComplete()) {
      return '<div class="thinking-log-empty">Klik op "Start denken" om het redeneringsproces te zien</div>';
    }

    return this.steps.map((step, index) => {
      if (step.status === 'pending') return '';
      
      const isCurrent = index === this.currentStep && this.isRunning;
      const timestamp = this.getTimestamp(step);
      
      return `
        <div class="thinking-log-entry ${isCurrent ? 'current' : ''}" data-step="${index}">
          <span class="thinking-log-time">${timestamp}</span>
          <span class="thinking-log-step">${step.title}</span>
          ${isCurrent ? '<span class="thinking-log-dots"><span>.</span><span>.</span><span>.</span></span>' : ''}
          ${step.status === 'done' ? '<span class="thinking-log-done">✓</span>' : ''}
        </div>
      `;
    }).join('');
  }

  private bindEvents(): void {
    if (!this.container) return;

    this.container.querySelector('#thinking-start')?.addEventListener('click', () => this.startThinking());
    this.container.querySelector('#thinking-reset')?.addEventListener('click', () => this.reset());
    this.container.querySelector('#thinking-skip')?.addEventListener('click', () => this.skipToEnd());
    this.container.querySelector('#thinking-show-diff')?.addEventListener('click', () => this.showDiff());
    this.container.querySelector('#thinking-apply-direct')?.addEventListener('click', () => this.applyDirect());
  }

  private startThinking(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentStep = 0;
    this.steps.forEach(s => s.status = 'pending');
    this.steps[0].status = 'active';
    this.stepStartTime = Date.now();
    this.render();
    this.runSteps();
  }

  private async runSteps(): void {
    for (let i = 0; i < this.steps.length; i++) {
      if (!this.isRunning) break;
      
      this.currentStep = i;
      this.steps[i].status = 'active';
      this.stepStartTime = Date.now();
      this.updateStepDisplay(i);
      this.addLogEntry(i);
      
      // Simulate step duration with sub-steps
      const step = this.steps[i];
      const subSteps = step.details?.length || 3;
      const stepDuration = step.duration || 1000;
      const subDuration = stepDuration / subSteps;
      
      for (let j = 0; j < subSteps; j++) {
        if (!this.isRunning) break;
        await this.sleep(subDuration);
        // Update progress within step
        this.updateStepProgress(i, (j + 1) / subSteps * 100);
      }
      
      this.steps[i].status = 'done';
      this.updateStepDisplay(i);
      this.updateLogEntry(i, true);
      
      // Small pause between steps
      await this.sleep(200);
    }
    
    this.isRunning = false;
    this.render();
  }

  private updateStepDisplay(index: number): void {
    const stepEl = this.container?.querySelector(`.thinking-step[data-step="${index}"]`);
    if (!stepEl) return;

    const step = this.steps[index];
    stepEl.classList.toggle('done', step.status === 'done');
    stepEl.classList.toggle('active', step.status === 'active');
    
    const marker = stepEl.querySelector('.thinking-step-circle');
    if (marker) {
      marker.innerHTML = step.status === 'done' ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ` : step.status === 'active' ? `
        <div class="thinking-step-spinner"></div>
      ` : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      `;
    }
  }

  private updateStepProgress(index: number, progress: number): void {
    const stepEl = this.container?.querySelector(`.thinking-step[data-step="${index}"]`);
    if (stepEl) {
      stepEl.style.setProperty('--progress', `${progress}%`);
    }
  }

  private addLogEntry(index: number): void {
    const logContainer = this.container?.querySelector('#thinking-log');
    if (!logContainer) return;

    const entry = document.createElement('div');
    entry.className = 'thinking-log-entry current';
    entry.dataset.step = String(index);
    const step = this.steps[index];
    entry.innerHTML = `
      <span class="thinking-log-time">${this.getTimestamp(step)}</span>
      <span class="thinking-log-step">${step.title}</span>
      <span class="thinking-log-dots"><span>.</span><span>.</span><span>.</span></span>
    `;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  private updateLogEntry(index: number, done: boolean): void {
    const entry = this.container?.querySelector(`.thinking-log-entry[data-step="${index}"]`);
    if (!entry) return;

    entry.classList.remove('current');
    if (done) {
      entry.classList.add('done');
      const dots = entry.querySelector('.thinking-log-dots');
      if (dots) dots.remove();
      entry.insertAdjacentHTML('beforeend', '<span class="thinking-log-done">✓</span>');
    }
  }

  private skipToEnd(): void {
    this.isRunning = false;
    this.steps.forEach(s => s.status = 'done');
    this.currentStep = this.steps.length - 1;
    this.render();
  }

  private reset(): void {
    this.isRunning = false;
    this.currentStep = 0;
    this.steps.forEach(s => s.status = 'pending');
    this.render();
  }

  private showDiff(): void {
    // Switch to diff tab
    const diffTab = document.getElementById('tab-ide') as HTMLButtonElement;
    diffTab?.click();
    this.showToast('Schakelt naar Diff weergave...', 'info');
  }

  private applyDirect(): void {
    this.showToast('Wijzigingen direct toegepast!', 'success');
  }

  private getCurrentStep(): ThinkingStep | undefined {
    return this.steps[this.currentStep];
  }

  private getCurrentStatusText(): string {
    if (!this.isRunning && !this.isComplete()) return 'Klaar om te starten';
    if (this.isComplete()) return 'Denkproces voltooid';
    const step = this.getCurrentStep();
    return step ? `Stap ${this.currentStep + 1}: ${step.title}` : 'Bezig...';
  }

  private isComplete(): boolean {
    return this.steps.every(s => s.status === 'done');
  }

  private getStepProgress(): number {
    if (!this.isRunning) return 0;
    const step = this.steps[this.currentStep];
    const elapsed = Date.now() - this.stepStartTime;
    const duration = step.duration || 1000;
    return Math.min(100, (elapsed / duration) * 100);
  }

  private getTimestamp(step: ThinkingStep): string {
    const now = new Date();
    return now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<div class="toast-content"><div class="toast-message">${message}</div></div>`;
    
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }
}