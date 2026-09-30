/* ==========================================================================
   Teach Mode Demo — Socratic teaching mode
   ========================================================================== */

interface TeachStep {
  id: string;
  question: string;
  hint?: string;
  answer: string;
  explanation: string;
  codeExample?: string;
}

export class TeachModeDemo {
  private container: HTMLElement | null = null;
  private currentStep = 0;
  private showAnswer = false;
  private steps: TeachStep[] = [];

  constructor() {
    this.initSteps();
    this.init();
  }

  private initSteps(): void {
    this.steps = [
      {
        id: 'why-usememo',
        question: 'Waarom gebruiken we `useMemo` in deze component?',
        hint: 'Kijk naar wat er in de callback van useMemo gebeurt en hoe vaak de component herrendert.',
        answer: 'Om dure berekeningen te memoïsiren zodat ze niet bij elke render opnieuw worden uitgevoerd.',
        explanation: '`useMemo` cached het resultaat van een functie en herberekent alleen wanneer de dependencies veranderen. Zonder `useMemo` zou `expensiveComputation(a, b)` bij **elke** render van `ParentComponent` draaien — ook als `a` en `b` niet veranderen.',
        codeExample: `function ParentComponent() {
  const [count, setCount] = useState(0);
  const [a, setA] = useState(10);
  const [b, setB] = useState(20);

  // ❌ Zonder useMemo: draait bij ELKE render (ook bij count++)
  const result = expensiveComputation(a, b);

  // ✅ Met useMemo: herberekent alleen als a of b verandert
  const memoizedResult = useMemo(
    () => expensiveComputation(a, b),
    [a, b]
  );

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild value={memoizedResult} />
    </div>
  );
}`
      },
      {
        id: 'dependency-array',
        question: 'Wat gebeurt er als je de dependency array `[a, b]` vergeet?',
        hint: 'Wat is de default waarde van de dependency array?',
        answer: 'De functie draait bij **elke** render — memoïsatie werkt niet meer.',
        explanation: 'Zonder dependency array (of met `undefined`) vergelijk React de dependencies niet en voert de callback elke render uit. Dit is erger dan geen `useMemo` want je hebt nu de overhead van de hook **en** de herberekening.',
        codeExample: `// ❌ FOUT: geen dependency array = elke render
const result = useMemo(() => expensiveComputation(a, b));

// ❌ FOUT: lege array = alleen eerste render (stale closures!)
const result = useMemo(() => expensiveComputation(a, b), []);

// ✅ CORRECT: dependencies specificeren
const result = useMemo(() => expensiveComputation(a, b), [a, b]);`
      },
      {
        id: 'usememo-vs-usecallback',
        question: 'Wat is het verschil tussen `useMemo` en `useCallback`?',
        hint: 'Wat returnen ze respectievelijk?',
        answer: '`useMemo` returned een **gewone waarde**, `useCallback` returned een **gememoïseerde functie**.',
        explanation: '`useCallback(fn, deps)` is equivalent aan `useMemo(() => fn, deps)`. Gebruik `useCallback` als je een functie als prop doorgeeft aan geoptimaliseerde child components (`React.memo`), zodat de functie referentie stabiel blijft.',
        codeExample: `// useMemo: voor waarden
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

// useCallback: voor functies (props aan memo'd children)
const handleClick = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);

// Gebruik:
<UserList users={sortedUsers} onSelect={handleClick} />`
      },
      {
        id: 'when-not-to-use',
        question: 'Wanneer moet je useMemo NIET gebruiken?',
        hint: 'Denk aan de overhead van de hook zelf.',
        answer: 'Als de berekening goedkoper is dan de overhead van useMemo zelf, of voor primitive waarden die cheap zijn om te maken.',
        explanation: '`useMemo` heeft overhead: het moet dependencies vergelijken, de cache opslaan, etc. Voor simpele operaties (string concatenatie, simpele math, kleine array filter) is de overhead duurder dan de berekening zelf.',
        codeExample: `// ❌ ONNODIG: overhead > winst
const fullName = useMemo(() => \`\${firstName} \${lastName}\`, [firstName, lastName]);
const doubled = useMemo(() => count * 2, [count]);
const isActive = useMemo(() => status === 'active', [status]);

// ✅ GOED: dure operaties
const processedData = useMemo(() => 
  hugeDataset
    .filter(item => item.active)
    .map(item => transformComplex(item))
    .sort((a, b) => a.priority - b.priority),
  [hugeDataset]
);`
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
    this.container = document.getElementById('teach-mode-demo');
    if (!this.container) return;

    this.container.innerHTML = this.getTeachHTML();
    this.bindEvents();
  }

  private getTeachHTML(): string {
    const step = this.steps[this.currentStep];
    const progress = ((this.currentStep + 1) / this.steps.length) * 100;

    return `
      <div class="teach-viewer">
        <!-- Progress Header -->
        <div class="teach-header">
          <div class="teach-progress-container">
            <div class="teach-progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
              <div class="teach-progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="teach-progress-text">Vraag ${this.currentStep + 1} van ${this.steps.length}</span>
          </div>
          <h3 class="teach-title">Teach Me: useMemo Deep Dive</h3>
          <p class="teach-subtitle">Leer waarom, niet alleen hoe. Beantwoord de vragen stap voor stap.</p>
        </div>

        <!-- Question Card -->
        <div class="teach-question-card" data-step="${this.currentStep}">
          <div class="teach-question-header">
            <span class="teach-question-badge">Vraag</span>
            ${this.showAnswer ? '<span class="teach-answer-badge">Antwoord getoond</span>' : ''}
          </div>
          
          <div class="teach-question-content">
            <p class="teach-question-text">${step.question}</p>
            
            ${!this.showAnswer && step.hint ? `
              <button class="btn btn-ghost btn-sm teach-hint-btn" id="teach-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                Hint tonen
              </button>
            ` : ''}

            ${this.showAnswer ? `
              <div class="teach-answer-reveal">
                <div class="teach-answer-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Antwoord</span>
                </div>
                <p class="teach-answer-text">${step.answer}</p>
              </div>
            ` : `
              <button class="btn btn-primary teach-reveal-btn" id="teach-reveal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Antwoord onthullen
              </button>
            `}
          </div>
        </div>

        <!-- Explanation (shown after answer) -->
        ${this.showAnswer ? `
          <div class="teach-explanation" data-animate="fade-up">
            <div class="teach-explanation-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Uitleg</span>
            </div>
            <div class="teach-explanation-content">
              <p>${step.explanation}</p>
              ${step.codeExample ? `
                <div class="teach-code-example">
                  <div class="teach-code-header">
                    <span>Voorbeeld</span>
                    <button class="btn btn-ghost btn-sm teach-copy-btn" data-code="${this.escapeHtml(step.codeExample)}" aria-label="Kopieer code">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                  </div>
                  <pre class="teach-code"><code>${this.highlightCode(this.escapeHtml(step.codeExample))}</code></pre>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Navigation -->
        <div class="teach-navigation">
          <button class="btn btn-secondary" id="teach-prev" ${this.currentStep === 0 ? 'disabled' : ''} aria-label="Vorige vraag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Vorige
          </button>
          
          <div class="teach-step-dots" role="tablist" aria-label="Vraag navigatie">
            ${this.steps.map((_, i) => `
              <button role="tab" aria-selected="${i === this.currentStep}" 
                class="teach-step-dot ${i === this.currentStep ? 'active' : ''} ${i < this.currentStep ? 'completed' : ''}"
                data-step="${i}" aria-label="Ga naar vraag ${i + 1}">
                ${i < this.currentStep ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              </button>
            `).join('')}
          </div>
          
          <button class="btn btn-primary" id="teach-next" ${this.currentStep === this.steps.length - 1 ? 'disabled' : ''} aria-label="Volgende vraag">
            Volgende
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- Completion State -->
        ${this.currentStep === this.steps.length - 1 && this.showAnswer ? `
          <div class="teach-completion" data-animate="scale">
            <div class="teach-completion-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="16 11 12 15 8 11"/>
              </svg>
            </div>
            <h4>Les voltooid! 🎓</h4>
            <p>Je begrijpt nu waarom useMemo belangrijk is. Wil je doorgaan met useCallback?</p>
            <div class="teach-completion-actions">
              <button class="btn btn-primary" id="teach-restart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6"/>
                  <path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                Opnieuw beginnen
              </button>
              <button class="btn btn-secondary" id="teach-next-topic">
                Volgende onderwerp: useCallback
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private bindEvents(): void {
    if (!this.container) return;

    // Reveal answer
    this.container.querySelector('#teach-reveal')?.addEventListener('click', () => this.revealAnswer());
    
    // Show hint
    this.container.querySelector('#teach-hint')?.addEventListener('click', () => this.showHint());

    // Navigation
    this.container.querySelector('#teach-prev')?.addEventListener('click', () => this.goToStep(this.currentStep - 1));
    this.container.querySelector('#teach-next')?.addEventListener('click', () => this.goToStep(this.currentStep + 1));

    // Step dots
    this.container.querySelectorAll('.teach-step-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const step = parseInt(dot.getAttribute('data-step') || '0', 10);
        this.goToStep(step);
      });
    });

    // Copy code
    this.container.querySelectorAll('.teach-copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.copyCode(btn.getAttribute('data-code') || ''));
    });

    // Restart / Next topic
    this.container.querySelector('#teach-restart')?.addEventListener('click', () => this.restart());
    this.container.querySelector('#teach-next-topic')?.addEventListener('click', () => this.nextTopic());
  }

  private revealAnswer(): void {
    this.showAnswer = true;
    this.render();
  }

  private showHint(): void {
    const step = this.steps[this.currentStep];
    if (!step.hint) return;
    
    // Show hint as toast
    this.showToast(step.hint, 'info');
  }

  private goToStep(index: number): void {
    if (index < 0 || index >= this.steps.length) return;
    this.currentStep = index;
    this.showAnswer = false;
    this.render();
  }

  private restart(): void {
    this.currentStep = 0;
    this.showAnswer = false;
    this.render();
  }

  private nextTopic(): void {
    this.showToast('useCallback les zou hier starten...', 'info');
  }

  private copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.showToast('Code gekopieerd!', 'success');
    }).catch(() => {
      this.showToast('Kopiëren mislukt', 'error');
    });
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
    `;
    
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

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private highlightCode(code: string): string {
    return code
      .replace(/\b(useMemo|useCallback|useState|useEffect|const|let|function|return|if|else|import|export|from|as|interface|type)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(string|number|boolean|void|any|React|JSX)\b/g, '<span class="type">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="const">$1</span>')
      .replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, '<span class="str">$1</span>')
      .replace(/(`[^`]*`)/g, '<span class="str">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
  }
}