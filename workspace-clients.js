/* Nonpersonal compatibility handshake. Never reads school/pupil data or deletes app caches. */
self.addEventListener('message', event => {
  if (event.data?.type !== 'SSR_CHECK_RESET_CLIENTS' || !event.ports[0]) return;
  event.waitUntil((async () => {
    const scope = new URL(self.registration.scope);
    const windows = (await self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .filter(client => { const url = new URL(client.url); return url.origin === scope.origin && url.pathname.startsWith(scope.pathname); });
    const replies = await Promise.all(windows.map(client => new Promise(resolve => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); resolve(false); }, 2200);
      channel.port1.onmessage = response => { clearTimeout(timer); channel.port1.close(); resolve(response.data?.resetProtocol === 1); };
      client.postMessage({ type: 'SSR_RESET_CLIENT_CHECK' }, [channel.port2]);
    })));
    event.ports[0].postMessage({ safe: windows.length > 0 && replies.every(Boolean) });
  })());
});
