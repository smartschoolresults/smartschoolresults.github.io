/* SSR waiting-worker version proof (P6-3). Nonpersonal. */
self.addEventListener('message', (event) => { if (event.data?.type === 'SSR_GET_VERSION' && event.ports[0]) event.ports[0].postMessage({ type: 'SSR_VERSION', version: "1.3.0" }); });
