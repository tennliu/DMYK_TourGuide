(function () {
  'use strict';
  // GoMaps Analytics v2; original DMYKMetrics.track API remains unchanged.
  const districtId = 'DMYK';
  const experienceId = 'dmyk_tourguide';
  const url = new URL(window.location.href);
  const medium = (url.searchParams.get('utm_medium') || '').trim().toLowerCase();
  const hasCampaignTag = ['utm_medium', 'utm_source', 'utm_campaign', 'utm_content'].some(
    key => url.searchParams.has(key)
  );
  // Explicit UTM always takes precedence over the legacy print-run marker.
  // The already-printed ?v=18 URL is now intentionally attributed to QR.
  // This is an attribution convention, not proof of a physical scan.
  const entryPoint = medium === 'nfc' ? 'nfc' : medium === 'qr' ? 'qr'
    : hasCampaignTag ? 'other'
    : url.searchParams.get('v') === '18' ? 'qr' : 'unknown';
  const rawLanguage = String(navigator.languages?.[0] || navigator.language || '').toLowerCase();
  const browserLanguageGroup = /^zh(?:-|$)/.test(rawLanguage) ? 'zh'
    : /^en(?:-|$)/.test(rawLanguage) ? 'en' : 'other';

  function emit(name, extras) {
    try {
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', name, Object.assign({
        district_id: districtId,
        experience_id: experienceId,
        entry_point: entryPoint,
        browser_language_group: browserLanguageGroup
      }, extras || {}));
    } catch (_) {
      // Never interrupt the guide if analytics is unavailable.
    }
  }

  // The Google tag itself sends page_view. This separate business event
  // measures each entrance to the TourGuide as one visit.
  emit('experience_visit');
  try {
    const key = 'gomaps:v2:seen:' + experienceId;
    if (!window.localStorage.getItem(key)) {
      emit('experience_first_visit');
      window.localStorage.setItem(key, '1');
    }
  } catch (_) {
    // Do not repeatedly mark visitors as new when storage is blocked.
  }

  function track(action, lang) {
    // Old 'all' aggregates were CounterAPI-only. Ignore to avoid duplicates.
    // Language usage is based on the map_open event when its iframe loads.
    // The historic language_select event is not sent by v2.
    if (!['map_open', 'share_click', 'share_complete'].includes(action)) return;
    if (!lang || lang === 'all') return;
    emit(action, { selected_language: lang });
  }

  window.DMYKMetrics = Object.freeze({ track });
})();
