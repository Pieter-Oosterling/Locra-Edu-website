/* ==========================================================================
   Footer Component
   ========================================================================== */

export function renderFooter(): string {
  return `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="Locra CodeMatch - Home">
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" stroke-width="2"/>
              <path d="M8 16l6 6 10-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Locra CodeMatch
          </a>
          <p class="footer-tagline">
            De veilige, lokale AI-oplossing voor het onderwijs. Volledige privacy, eigen servers, gemaakt voor Nederlandse scholen.
          </p>
          <div class="footer-social">
            <a href="https://github.com/locra/codematch" target="_blank" rel="noopener" class="footer-social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://twitter.com/locra_ai" target="_blank" rel="noopener" class="footer-social-link" aria-label="Twitter/X">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.72h-3.308l-7.227-8.26 8.502-9.72z"/></svg>
            </a>
            <a href="https://linkedin.com/company/locra" target="_blank" rel="noopener" class="footer-social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:info@locra.nl" class="footer-social-link" aria-label="E-mail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-column">
          <h4>Product</h4>
          <nav class="footer-links">
            <a href="#demo" class="footer-link">CodeMatch Demo</a>
            <a href="#features" class="footer-link">Features</a>
            <a href="#pricing" class="footer-link">Prijzen</a>
            <a href="https://github.com/locra/codematch" target="_blank" rel="noopener" class="footer-link">GitHub</a>
            <a href="#changelog" class="footer-link">Changelog</a>
            <a href="#roadmap" class="footer-link">Roadmap</a>
          </nav>
        </div>

        <div class="footer-column">
          <h4>Onderwijs</h4>
          <nav class="footer-links">
            <a href="#education" class="footer-link">EDU-Plus Features</a>
            <a href="#kennisnet" class="footer-link">Kennisnet SSO</a>
            <a href="#somtoday" class="footer-link">SOMtoday Koppeling</a>
            <a href="#examenstand" class="footer-link">Examenstand</a>
            <a href="#academy" class="footer-link">Academy & Leerdoelen</a>
            <a href="#privacy-education" class="footer-link">Privacy voor Scholen</a>
          </nav>
        </div>

        <div class="footer-column">
          <h4>Bedrijf</h4>
          <nav class="footer-links">
            <a href="#over-ons" class="footer-link">Over Locra</a>
            <a href="#blog" class="footer-link">Blog</a>
            <a href="#carriere" class="footer-link">Carrière</a>
            <a href="#contact" class="footer-link">Contact</a>
            <a href="#privacy" class="footer-link">Privacybeleid</a>
            <a href="#voorwaarden" class="footer-link">Voorwaarden</a>
          </nav>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">© 2024 Locra. Alle rechten voorbehouden.</p>
        <nav class="footer-legal">
          <a href="#privacy" class="footer-legal-link">Privacybeleid</a>
          <a href="#voorwaarden" class="footer-legal-link">Gebruiksvoorwaarden</a>
          <a href="#cookies" class="footer-legal-link">Cookiebeleid</a>
          <a href="#security" class="footer-legal-link">Beveiliging</a>
        </nav>
      </div>
    </div>
  `;
}

export function initFooter(): void {
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = renderFooter();
  }
}