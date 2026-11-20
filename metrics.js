(function () {
  const ENDPOINT = 'https://counterapi.com/api';
  const NAMESPACE = 'tennliu.github.io';
  const APP_KEY = 'DMYK_TourGuide';

  function taipeiMonthKey() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit'
    }).formatToParts(new Date());

    const year = parts.find(part => part.type === 'year')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    return year && month ? `${year}-${month}` : 'unknown-month';
  }

  const GA4_EVENTS = new Set([
    'language_select',
    'map_open',
    'share_click',
    'share_complete'
  ]);

  function trackGoogleAnalytics(action, lang) {
    // GA4 automatically collects page_view; do not send the CounterAPI
    // 'all' share aggregate again, or sharing would be double-counted.
    if (action === 'page_view' || lang === 'all' || !GA4_EVENTS.has(action)) return;
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
          district_id: 'DMYK',
          language: lang
        });
      }
    } catch (_) {
      // Analytics must never interrupt the existing guide or CounterAPI.
    }
  }

  function track(action, lang) {
    if (!action || !lang) return;

    trackGoogleAnalytics(action, lang);

    const key = `${APP_KEY}-${taipeiMonthKey()}-${lang}`;
    const url = `${ENDPOINT}/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(action)}/${encodeURIComponent(key)}?trackOnly=true`;

    fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      keepalive: true
    }).catch(() => {});
  }

  window.DMYKMetrics = Object.freeze({ track });
})();