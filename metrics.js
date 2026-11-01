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

  function track(action, lang) {
    if (!action || !lang) return;

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