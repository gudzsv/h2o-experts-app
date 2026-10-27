// Loaded into the generated service worker (workbox `importScripts`).
// A click on a drink reminder focuses the open app or opens the tracker.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(windows => {
        const open = windows.find(client => 'focus' in client);
        return open ? open.focus() : self.clients.openWindow('/tracker');
      })
  );
});
