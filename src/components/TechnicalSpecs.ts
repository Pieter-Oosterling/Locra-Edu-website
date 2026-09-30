/* ==========================================================================
   Technical Specs Component
   ========================================================================== */

interface TechSpec {
  icon: string;
  value: string;
  label: string;
  description?: string;
}

const techSpecs: TechSpec[] = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M12 8v4"/></svg>`,
    value: '100%',
    label: 'Lokaal draaiend',
    description: 'Geen data verlaat uw netwerk'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    value: 'AVG',
    label: 'Compliant',
    description: 'Volledig AVG/OER compliant'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    value: '<100ms',
    label: 'Latentie (lokaal)',
    description: 'Ollama op eigen hardware'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    value: '∞',
    label: 'Schaalbaarheid',
    description: 'Horizontaal schaalbaar met Kubernetes'
  }
];

const architectureDiagram = `
<svg class="diagram-svg" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Locra CodeMatch architectuur diagram">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border-default)"/>
    </marker>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- User Layer -->
  <g class="diagram-layer" id="layer-user">
    <rect x="50" y="50" width="200" height="120" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-accent-primary)" stroke-width="2" filter="url(#glow)"/>
    <text x="150" y="85" class="diagram-node-title" text-anchor="middle">Leerling / Docent</text>
    <text x="150" y="115" class="diagram-label" text-anchor="middle">Browser (PWA)</text>
    <text x="150" y="145" class="diagram-label" text-anchor="middle">CodeMatch UI</text>
  </g>

  <!-- Load Balancer -->
  <g class="diagram-layer" id="layer-lb">
    <rect x="300" y="80" width="180" height="60" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-border-default)" stroke-width="1.5"/>
    <text x="390" y="110" class="diagram-node-title" text-anchor="middle">Load Balancer</text>
    <text x="390" y="130" class="diagram-label" text-anchor="middle">nginx / Traefik</text>
  </g>

  <!-- App Server -->
  <g class="diagram-layer" id="layer-app">
    <rect x="300" y="180" width="180" height="140" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-accent-primary)" stroke-width="2" filter="url(#glow)"/>
    <text x="390" y="215" class="diagram-node-title" text-anchor="middle">Locra Server</text>
    <text x="390" y="240" class="diagram-label" text-anchor="middle">Go / Node.js API</text>
    <text x="390" y="265" class="diagram-label" text-anchor="middle">Auth, Quota, RAG</text>
    <text x="390" y="290" class="diagram-label" text-anchor="middle">WebSocket Server</text>
  </g>

  <!-- Database -->
  <g class="diagram-layer" id="layer-db">
    <rect x="550" y="80" width="180" height="100" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-success)" stroke-width="2"/>
    <text x="640" y="110" class="diagram-node-title" text-anchor="middle">Database</text>
    <text x="640" y="135" class="diagram-label" text-anchor="middle">PostgreSQL</text>
    <text x="640" y="160" class="diagram-label" text-anchor="middle">Chats, Users, Quota</text>
  </g>

  <!-- Vector DB -->
  <g class="diagram-layer" id="layer-vectordb">
    <rect x="550" y="220" width="180" height="100" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-purple)" stroke-width="2"/>
    <text x="640" y="250" class="diagram-node-title" text-anchor="middle">Vector Store</text>
    <text x="640" y="275" class="diagram-label" text-anchor="middle">pgvector / Qdrant</text>
    <text x="640" y="300" class="diagram-label" text-anchor="middle">Embeddings (RAG)</text>
  </g>

  <!-- Local AI -->
  <g class="diagram-layer" id="layer-local-ai">
    <rect x="50" y="230" width="200" height="100" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-accent-primary)" stroke-width="2" filter="url(#glow)"/>
    <text x="150" y="260" class="diagram-node-title" text-anchor="middle">Lokale AI (Ollama)</text>
    <text x="150" y="285" class="diagram-label" text-anchor="middle">Llama 3 / Mistral</text>
    <text x="150" y="310" class="diagram-label" text-anchor="middle">CodeLlama / Gemma</text>
  </g>

  <!-- Cloud AI -->
  <g class="diagram-layer" id="layer-cloud-ai">
    <rect x="50" y="350" width="200" height="60" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-border-default)" stroke-width="1.5" stroke-dasharray="5,5"/>
    <text x="150" y="380" class="diagram-node-title" text-anchor="middle">Cloud AI (Optioneel)</text>
    <text x="150" y="400" class="diagram-label" text-anchor="middle">OpenAI, Anthropic, OpenRouter</text>
  </g>

  <!-- SSO -->
  <g class="diagram-layer" id="layer-sso">
    <rect x="300" y="350" width="180" height="60" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-warning)" stroke-width="2"/>
    <text x="390" y="375" class="diagram-node-title" text-anchor="middle">Kennisnet SSO</text>
    <text x="390" y="395" class="diagram-label" text-anchor="middle">Entree Federation</text>
  </g>

  <!-- SOMtoday -->
  <g class="diagram-layer" id="layer-somtoday">
    <rect x="550" y="350" width="180" height="60" rx="12" fill="var(--color-bg-elevated)" stroke="var(--color-warning)" stroke-width="2"/>
    <text x="640" y="375" class="diagram-node-title" text-anchor="middle">SOMtoday API</text>
    <text x="640" y="395" class="diagram-label" text-anchor="middle">Rooster, Cijfers, Klassen</text>
  </g>

  <!-- Edges/Connections -->
  <g class="diagram-edges" stroke="var(--color-border-default)" stroke-width="2" fill="none" marker-end="url(#arrowhead)">
    <!-- User -> LB -->
    <path class="diagram-edge" d="M250 110 H300"/>
    <!-- LB -> App -->
    <path class="diagram-edge" d="M390 140 V180"/>
    <!-- App -> DB -->
    <path class="diagram-edge" d="M480 230 H550"/>
    <!-- App -> Vector DB -->
    <path class="diagram-edge" d="M480 290 H550"/>
    <!-- App -> Local AI -->
    <path class="diagram-edge" d="M300 250 Q150 250 150 280"/>
    <!-- App -> Cloud AI (dashed) -->
    <path class="diagram-edge" d="M300 320 Q150 320 150 360" stroke-dasharray="5,5"/>
    <!-- App -> SSO -->
    <path class="diagram-edge" d="M390 320 V350"/>
    <!-- App -> SOMtoday -->
    <path class="diagram-edge" d="M480 320 H550"/>
  </g>

  <!-- Legend -->
  <g class="diagram-legend" transform="translate(50, 420)">
    <rect x="0" y="0" width="700" height="50" rx="8" fill="var(--color-bg-elevated)" stroke="var(--color-border-subtle)"/>
    <g transform="translate(20, 15)">
      <circle cx="0" cy="0" r="6" fill="var(--color-accent-primary)"/>
      <text x="15" y="5" class="diagram-label" font-size="12">Core Services</text>
    </g>
    <g transform="translate(150, 15)">
      <circle cx="0" cy="0" r="6" fill="var(--color-success)"/>
      <text x="15" y="5" class="diagram-label" font-size="12">Data Persistentie</text>
    </g>
    <g transform="translate(320, 15)">
      <circle cx="0" cy="0" r="6" fill="var(--color-purple)"/>
      <text x="15" y="5" class="diagram-label" font-size="12">AI / Embeddings</text>
    </g>
    <g transform="translate(500, 15)">
      <circle cx="0" cy="0" r="6" fill="var(--color-warning)"/>
      <text x="15" y="5" class="diagram-label" font-size="12">Externe Integraties</text>
    </g>
    <g transform="translate(660, 15)">
      <circle cx="0" cy="0" r="6" fill="none" stroke="var(--color-border-default)" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="15" y="5" class="diagram-label" font-size="12">Optioneel</text>
    </g>
  </g>
</svg>
`;

export function renderTechnicalSpecs(): string {
  return techSpecs.map((spec, index) => `
    <article class="card tech-spec-card" data-animate="fade-up" data-delay="${index * 100}">
      <div class="tech-spec-icon" aria-hidden="true">
        ${spec.icon}
      </div>
      <div class="tech-spec-value">${spec.value}</div>
      <div class="tech-spec-label">${spec.label}</div>
      ${spec.description ? `<p class="tech-spec-desc" style="margin-top: var(--space-2); font-size: var(--text-xs); color: var(--color-text-tertiary);">${spec.description}</p>` : ''}
    </article>
  `).join('');
}

export function initTechnicalSpecs(): void {
  const specsContainer = document.getElementById('technical-specs');
  const diagramContainer = document.getElementById('architecture-diagram');
  
  if (specsContainer) {
    specsContainer.innerHTML = renderTechnicalSpecs();
  }
  if (diagramContainer) {
    diagramContainer.innerHTML = architectureDiagram;
  }
}