export function runQuickPerfAudit() {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return;

  let lcpTime = 0;
  try {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1] as any;
      if (last && typeof last.startTime === 'number') lcpTime = last.startTime;
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true as any });
    setTimeout(() => po.disconnect(), 10000);
  } catch {}

  function report() {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const total = resources.length + (nav ? 1 : 0);
    let bytes = 0;
    let imgCount = 0;
    for (const r of resources) {
      const size = (r as any).transferSize || (r as any).encodedBodySize || 0;
      bytes += size;
      if ((r.initiatorType || '').toLowerCase() === 'img') imgCount++;
    }
    const kb = (bytes / 1024).toFixed(1);
    const lcp = (lcpTime || (nav ? nav.responseEnd : 0)).toFixed(2);

    const summary = { LCP_ms: lcp, TotalRequests: total, ImageRequests: imgCount, TotalKB: kb };
    console.info('[Perf Audit]', summary);
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'perf_audit', {
        event_category: 'performance',
        LCP_ms: Number(lcp),
        TotalRequests: total,
        ImageRequests: imgCount,
        TotalKB: Number(kb)
      });
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(report, 0);
  } else {
    window.addEventListener('load', () => setTimeout(report, 0), { once: true });
  }
}
