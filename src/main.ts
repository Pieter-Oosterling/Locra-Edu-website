/* ==========================================================================
   Main Entry Point — Initializes all components
   ========================================================================== */

import './styles/main.css';

// Components
import { renderHeader, initHeader } from './components/Header';
import { initHero } from './components/Hero';
import { initEducationFeatures } from './components/EducationFeatures';
import { initGeneralFeatures } from './components/GeneralFeatures';
import { initTechnicalSpecs } from './components/TechnicalSpecs';
import { initPricingTiers } from './components/PricingTiers';
import { initFooter } from './components/Footer';
import { initCodeMatchShowcase } from './components/CodeMatchShowcase';

// Scripts
import { animationEngine } from './scripts/animation-engine';
import { themeToggle } from './scripts/theme-toggle';
import { navigation } from './scripts/navigation';
import { scrollReveal } from './scripts/scroll-reveal';
import { CodeMatchDemo } from './scripts/codematch-demo';
import { PlanModeDemo } from './scripts/plan-mode-demo';
import { TeachModeDemo } from './scripts/teach-mode-demo';
import { ThinkingStatusDemo } from './scripts/thinking-status-demo';

// Initialize header & footer (static HTML injection)
document.getElementById('site-header')!.innerHTML = renderHeader();
initFooter();

// Initialize all components after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Core systems
  initHeader();
  initHero();
  initCodeMatchShowcase();
  initEducationFeatures();
  initGeneralFeatures();
  initTechnicalSpecs();
  initPricingTiers();

  // Interactive demos (these mount into the demo panels)
  new CodeMatchDemo();
  new PlanModeDemo();
  new TeachModeDemo();
  new ThinkingStatusDemo();

  // Demo tab initialization (handled by CodeMatchShowcase)
  
  console.log('🚀 Locra CodeMatch website loaded');
  console.log('🎨 Theme:', document.documentElement.getAttribute('data-theme'));
  console.log('♿ Reduced motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
});

// Handle view transitions for navigation (progressive enhancement)
if ('navigation' in window) {
  // @ts-ignore - Navigation API
  window.navigation.addEventListener('navigate', (event: any) => {
    if (event.destination.url === location.origin + location.pathname) {
      // Same page navigation - let smooth scroll handle it
      return;
    }
    // Cross-page navigation would use View Transitions API here
  });
}

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW not available, continue without
    });
  });
}

// Export for potential external use
export { animationEngine, themeToggle, navigation, scrollReveal };