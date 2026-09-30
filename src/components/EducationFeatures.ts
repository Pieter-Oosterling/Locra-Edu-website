/* ==========================================================================
   Education Features Data & Rendering
   ========================================================================== */

interface EduFeature {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  highlights: string[];
}

const educationFeatures: EduFeature[] = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    title: 'Academy & Leerdoelen',
    description: 'Complete leeromgeving met quizzes, theorie-modules, XP-systeem, levels en gedetailleerde voortgangsvolgging per leerling.',
    badge: 'EDU-Plus',
    badgeType: 'primary',
    highlights: ['Quizzes & oefentoetsen', 'Theorie modules met video', 'XP, levels & badges', 'Voortgangsdashboard per leerling', 'Leerdoelen gekoppeld aan kerndoelen']
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: 'Kennisnet Integratie (SSO)',
    description: 'Naadloze inlog voor leerlingen en docenten via Entree Federation. Geen wachtwoorden, directe toegang via schoolidentiteit.',
    badge: 'EDU-Plus',
    badgeType: 'primary',
    highlights: ['Entree Federation compliant', 'Automatisch account provisioning', 'Rollen & groepen via Kennisnet', 'Single Sign-Out ondersteuning', 'AVG-compliant gegevensverwerking']
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    title: 'SOMtoday Koppeling',
    description: 'Realtime synchronisatie van roosters, cijfers, klassen en leerlinggegevens direct vanuit SOMtoday.',
    badge: 'EDU-Plus',
    badgeType: 'primary',
    highlights: ['Roosterimport (lesuren/lokalen)', 'Cijfer & resultaat synchronisatie', 'Klassen & leerlingbeheer', 'Docent-koppelingen', 'Eenzijdig (read-only) of tweerichtingsverkeer']
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
    title: 'Klassen & Groepenbeheer',
    description: 'Docenten beheren hun klassen, stellen AI-limieten per klas of leerling in, en zien realtime wie er online is.',
    badge: 'EDU-Plus',
    badgeType: 'primary',
    highlights: ['Klasindeling importeren/syncen', 'Per-klas AI quota instellen', 'Individuele leerlinglimieten', 'Realtime aanwezigheid', 'Groepswerk modus']
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    title: 'Opdrachten (Assignments)',
    description: 'Docenten zetten AI-ondersteunde opdrachten uit. De AI begeleidt de leerling, docent kan meekijken en beoordelen.',
    badge: 'EDU-Plus',
    badgeType: 'primary',
    highlights: ['AI als tutor (niet generator)', 'Leerlingproces zichtbaar', 'Docent feedback loop', 'Rubrics & beoordelingscriteria', 'Plagiaatsignalen in dashboard']
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><line x1="12" y1="1" x2="12" y2="23"/></svg>`,
    title: 'Examenstand',
    description: 'Beheerders blokkeren tijdelijk internettoegang, bestandsuploads en externe AI-modellen tijdens toetsen/examens.',
    badge: 'EDU-Plus',
    badgeType: 'error',
    highlights: ['Internet toegang uitschakelen', 'Bestandsupload blokkeren', 'Alleen lokale modellen (Ollama)', 'Tijdschema\'s instellen', 'Audit log voor nazicht']
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 16h.01"/></svg>`,
    title: 'AI Watermarking & Plagiaatdetectie',
    description: 'Onzichtbare watermerken in gegenereerde teksten. Detecteer of leerlingen AI-tekst direct overnemen zonder verwerking.',
    badge: 'EDU-Plus',
    badgeType: 'warning',
    highlights: ['Onzichtbare Unicode watermerken', 'Statistische detectie AI-tekst', 'Kopieer/plak detectie', 'Rapportage per inleveropdracht', 'Bewijs voor examinatiecommissie']
  }
];

export function renderEducationFeatures(): string {
  return educationFeatures.map((feature, index) => `
    <article class="card feature-card" data-animate="fade-up" data-delay="${index * 100}">
      <div class="feature-card-icon" aria-hidden="true">
        ${feature.icon}
      </div>
      ${feature.badge ? `<span class="badge badge-${feature.badgeType || 'primary'}">${feature.badge}</span>` : ''}
      <h3 class="feature-card-title">${feature.title}</h3>
      <p class="feature-card-description">${feature.description}</p>
      <ul class="feature-highlights" style="margin-top: var(--space-4); padding-left: var(--space-4); list-style: none;">
        ${feature.highlights.map(h => `
          <li style="position: relative; padding-left: var(--space-3); margin-bottom: var(--space-2); font-size: var(--text-sm); color: var(--color-text-secondary);">
            <svg class="icon" style="position: absolute; left: 0; top: 0.2em; color: var(--color-success);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            ${h}
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');
}

export function initEducationFeatures(): void {
  const container = document.getElementById('education-features');
  if (container) {
    container.innerHTML = renderEducationFeatures();
  }
}