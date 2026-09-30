/* ==========================================================================
   General Features Data & Rendering
   ========================================================================== */

interface GeneralFeature {
  icon: string;
  title: string;
  description: string;
  tier: 'free' | 'pro' | 'enterprise';
}

const generalFeatures: GeneralFeature[] = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M12 8v4"/></svg>`,
    title: 'Multimodel AI Chat',
    description: 'Lokaal via Ollama (Llama, Mistral, CodeLlama) én cloud via OpenAI, Anthropic, OpenRouter, HuggingFace. Kies per chat.',
    tier: 'free'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    title: 'CodeMatch IDE',
    description: 'Volledige browser-IDE met syntax highlighting, GitHub integratie, diff-weergave, plan-modus en socratische teach-mode.',
    tier: 'free'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    title: 'RAG / Kennisbanken',
    description: 'Upload PDF, DOCX, TXT, MD. De AI gebruikt jouw documenten als context (RAG). Hybrid search: vector + keyword.',
    tier: 'free'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    title: 'Internet Toegang',
    description: 'AI zoekt live via DuckDuckGo voor actuele info. Bronnen worden geciteerd. Configureerbare zoekdiepte.',
    tier: 'free'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    title: 'Gedeelde & Samenwerkings-chats',
    description: 'Publieke links genereren of realtime samen typen in dezelfde chat (Google Docs-stijl). Rechten per deelnemer.',
    tier: 'pro'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    title: 'Afbeeldingen & Bestanden',
    description: 'Afbeeldingen genereren (DALL-E, Stable Diffusion) en bestanden analyseren (vision models). Drag & drop upload.',
    tier: 'pro'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    title: 'Quota & Credits Systeem',
    description: 'Dagelijkse/maandelijkse limieten, Deep Thinking quotum, budgettering per gebruiker/klas. Hard & soft limits.',
    tier: 'pro'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 21.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    title: 'Volledige Customization',
    description: 'Eigen AI-naam, system prompts, huisstijl-kleuren, logo, favicon, welkomstpagina\'s. White-label ready.',
    tier: 'enterprise'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    title: 'Rapportage & Audit Logging',
    description: 'Uitgebreid beheerdersdashboard: chatgeschiedenis, token usage, kosten, gebruikersstatistieken, export naar CSV/JSON.',
    tier: 'enterprise'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: 'Privacy & Netwerk',
    description: 'Lokale opslag (browser), E2E encryptie, dataretentie-tijden, IP-whitelisting. Open PCC compliant voor overheid/onderwijs.',
    tier: 'enterprise'
  }
];

export function renderGeneralFeatures(): string {
  return generalFeatures.map((feature, index) => `
    <article class="feature-item" data-animate="fade-up" data-delay="${index * 80}">
      <div class="feature-item-icon" aria-hidden="true">
        ${feature.icon}
      </div>
      <div class="feature-item-content">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1);">
          <h4 class="feature-item-title">${feature.title}</h4>
          <span class="badge badge-${feature.tier === 'free' ? 'success' : feature.tier === 'pro' ? 'warning' : 'primary'}">${feature.tier}</span>
        </div>
        <p class="feature-item-description">${feature.description}</p>
      </div>
    </article>
  `).join('');
}

export function initGeneralFeatures(): void {
  const container = document.getElementById('general-features');
  if (container) {
    container.innerHTML = renderGeneralFeatures();
  }
}