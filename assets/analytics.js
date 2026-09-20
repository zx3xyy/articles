/* Cloudflare Web Analytics: the beacon token is public, never an API key. */
(() => {
  'use strict';
  const token = 'ab5fc4cac832438c9517946471cd45ae'; // Set to this site's Cloudflare Web Analytics beacon token.
  if (!/^[a-f0-9]{32}$/i.test(token)) return;
  if (location.protocol !== 'https:' || location.hostname !== 'zx3xyy.github.io') return;
  if (location.pathname !== '/articles' && !location.pathname.startsWith('/articles/')) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  if (document.querySelector('script[data-cf-beacon]')) return;

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({ token, spa: false }));
  document.head.appendChild(beacon);
})();
