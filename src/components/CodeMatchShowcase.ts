/* ==========================================================================
   CodeMatch Showcase Component
   ========================================================================== */

export function initCodeMatchShowcase(): void {
  // Tab switching logic
  const tabs = document.querySelectorAll('.demo-tab');
  const panels = document.querySelectorAll('.demo-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      if (!targetTab) return;

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.hidden = false;
      }
    });
  });

  // Keyboard navigation for tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {
      let newIndex = index;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = tabs.length - 1;
      else return;

      e.preventDefault();
      (tabs[newIndex] as HTMLElement).click();
      (tabs[newIndex] as HTMLElement).focus();
    });
  });
}