/* ==========================================================================
   Feature Card Component
   ========================================================================== */

interface FeatureCardData {
  icon: string; // SVG string
  title: string;
  description: string;
  badge?: string;
  badgeType?: 'primary' | 'success' | 'warning' | 'error';
  link?: string;
}

export function renderFeatureCard(data: FeatureCardData): string {
  return `
    <article class="card feature-card card-lift" ${data.link ? `data-link="${data.link}"` : ''}>
      ${data.badge ? `<span class="badge badge-${data.badgeType || 'primary'}">${data.badge}</span>` : ''}
      <div class="feature-card-icon" aria-hidden="true">
        ${data.icon}
      </div>
      <h3 class="feature-card-title">${data.title}</h3>
      <p class="feature-card-description">${data.description}</p>
      ${data.link ? `
        <a href="${data.link}" class="link-underline" style="margin-top: var(--space-4); display: inline-flex; align-items: center; gap: var(--space-1); font-weight: var(--font-weight-medium);">
          Meer weten
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      ` : ''}
    </article>
  `;
}

export function renderFeatureItem(data: FeatureCardData): string {
  return `
    <div class="feature-item">
      <div class="feature-item-icon" aria-hidden="true">
        ${data.icon}
      </div>
      <div class="feature-item-content">
        <h4 class="feature-item-title">${data.title}</h4>
        <p class="feature-item-description">${data.description}</p>
      </div>
    </div>
  `;
}