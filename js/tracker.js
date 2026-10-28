(function() {
  try {
    const path = window.location.pathname || '/';
    const sessionKey = 'pv_logged_' + path;

    // Deduplicate within the same browser session
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');

      const data = JSON.stringify({
        path: path,
        referrer: document.referrer || 'Direct / Bookmark',
        screen: `${window.innerWidth}x${window.innerHeight}`
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/visit', new Blob([data], { type: 'application/json' }));
      } else {
        fetch('/api/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true
        }).catch(function() {});
      }
    }
  } catch (e) {
    // Fail silently
  }
})();
