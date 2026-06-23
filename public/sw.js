/* Service worker: web push bildirimlerini gösterir ve tıklanınca uygulamayı açar. */

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { body: event.data ? event.data.text() : '' }
  }

  const title = data.title || "Zeliş'in Kütüphanesi"
  const options = {
    body: data.body || '',
    icon: data.icon || '/cat-192.png',
    badge: '/cat-96.png',
    tag: data.tag || 'kitaplik',
    renotify: true,
    vibrate: [80, 40, 80],
    data: { url: data.url || '/', slot: data.slot || '' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const slot = (event.notification.data && event.notification.data.slot) || ''
  const target = '/?notif=' + encodeURIComponent(slot)

  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of all) {
        if ('focus' in client) {
          client.postMessage({ type: 'notif-click', slot })
          return client.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target)
    })(),
  )
})
