/* ==========================================================================
   Pricing Tiers Component
   ========================================================================== */

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: { name: string; included: boolean }[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect voor individuele docenten of kleine teams die lokaal willen experimenteren.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: 'Lokale AI (Ollama) onbeperkt', included: true },
      { name: 'CodeMatch IDE (volledig)', included: true },
      { name: 'RAG / Kennisbanken (50 docs)', included: true },
      { name: 'Internet zoeken (DuckDuckGo)', included: true },
      { name: 'Basis quota systeem', included: true },
      { name: 'Kennisnet SSO', included: false },
      { name: 'SOMtoday koppeling', included: false },
      { name: 'Examenstand', included: false },
      { name: 'Watermarking & Plagiaatdetectie', included: false },
      { name: 'Academy / Leerdoelen', included: false },
      { name: 'Opdrachten & Beoordeling', included: false },
      { name: 'Audit logging & Rapportage', included: false },
      { name: 'E2E Encryptie & IP-whitelisting', included: false },
      { name: 'Prioriteit support', included: false },
    ],
    ctaText: 'Gratis starten',
    ctaLink: 'https://github.com/locra/codematch'
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Voor scholen die AI structureel inzetten in de les. Met edukatieve features.',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    popular: true,
    features: [
      { name: 'Alles uit Starter', included: true },
      { name: 'Kennisnet SSO (Entree)', included: true },
      { name: 'SOMtoday synchronisatie', included: true },
      { name: 'Klassen & Groepenbeheer', included: true },
      { name: 'Opdrachten & Beoordeling', included: true },
      { name: 'Examenstand', included: true },
      { name: 'Academy / Leerdoelen (basis)', included: true },
      { name: 'Watermarking & Plagiaatdetectie', included: true },
      { name: 'Geavanceerde Quota (per klas/leerling)', included: true },
      { name: 'Samenwerkings-chats', included: true },
      { name: 'Afbeeldingen genereren', included: true },
      { name: 'Audit logging (90 dagen)', included: true },
      { name: 'E2E Encryptie', included: false },
      { name: 'IP-whitelisting', included: false },
      { name: 'Prioriteit support (e-mail)', included: true },
    ],
    ctaText: 'Professioneel starten',
    ctaLink: '#contact'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Voor grote scholengemeenschappen, gemeenten of overheid. Volledige controle & compliance.',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: [
      { name: 'Alles uit Professional', included: true },
      { name: 'Academy / Leerdoelen (volledig)', included: true },
      { name: 'Onbeperkte Kennisbanken', included: true },
      { name: 'E2E Encryptie (client-side)', included: true },
      { name: 'IP-whitelisting & Netwerkbeleid', included: true },
      { name: 'Open PCC Compliant', included: true },
      { name: 'Dataretentie & Verwijdering op verzoek', included: true },
      { name: 'Audit logging (onbeperkt)', included: true },
      { name: 'Custom SLA & Support (telefoon/Slack)', included: true },
      { name: 'White-label & Custom domein', included: true },
      { name: 'On-premise installatie ondersteuning', included: true },
      { name: 'Custom model fine-tuning', included: true },
      { name: 'Specialiste onboarding & training', included: true },
    ],
    ctaText: 'Offerte aanvragen',
    ctaLink: '#contact'
  }
];

export function renderPricingTiers(yearly = false): string {
  return pricingTiers.map(tier => `
    <article class="pricing-card ${tier.popular ? 'popular' : ''}" data-tier="${tier.id}">
      ${tier.popular ? '<span class="pricing-badge">Meest gekozen</span>' : ''}
      <div class="pricing-header">
        <h3 class="pricing-name">${tier.name}</h3>
        <p class="pricing-description">${tier.description}</p>
      </div>
      <div class="pricing-price">
        <span class="pricing-amount">€${yearly ? tier.yearlyPrice : tier.monthlyPrice}</span>
        <span class="pricing-period">/${yearly ? 'jaar' : 'maand'}</span>
        ${yearly && tier.monthlyPrice > 0 ? `<span class="pricing-save">≈ €${tier.monthlyPrice}/maand</span>` : ''}
      </div>
      <ul class="pricing-features">
        ${tier.features.map(f => `
          <li class="pricing-feature ${!f.included ? 'unavailable' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            ${f.name}
          </li>
        `).join('')}
      </ul>
      <a href="${tier.ctaLink}" class="btn ${tier.popular ? 'btn-primary' : 'btn-secondary'} pricing-cta" data-track="pricing-${tier.id}">
        ${tier.ctaText}
      </a>
    </article>
  `).join('');
}

export function initPricingTiers(): void {
  const container = document.getElementById('pricing-cards');
  const toggle = document.getElementById('billing-toggle') as HTMLInputElement;
  
  if (!container) return;

  // Initial render
  container.innerHTML = renderPricingTiers(false);

  // Toggle handler
  toggle?.addEventListener('change', () => {
    container.innerHTML = renderPricingTiers(toggle.checked);
  });
}