(function () {
  // GA4-only event bridge for the existing TourGuide UI.
  // Keep the window.DMYKMetrics interface so app.js remains unchanged.
  const GA4_EVENTS = new Set([
    'language_select',
    'map_open',
    'share_click',
    'share_complete'
  ]);

  function track(action, lang) {
    // The Google tag collects page_view automatically.
    // Existing 'all' share calls were CounterAPI aggregates;
    // GA4 should receive only one event per actual interaction.
    if (!GA4_EVENTS.has(action) || !lang || lang === 'all') return;

    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
          district_id: 'DMYK',
          selected_language: lang
        });
      }
    } catch (_) {
      // Tracking failures must not affect the guide.
    }
  }

  window.DMYKMetrics = Object.freeze({ track });
})();
