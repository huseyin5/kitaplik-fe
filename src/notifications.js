// Web push aboneliği: service worker'ı kaydeder, izin ister ve aboneliği
// backend'e gönderir. iOS'ta yalnızca uygulama "Ana Ekrana Ekle" ile PWA
// olarak kurulduğunda çalışır.
import { getVapidPublicKey, subscribePush, unsubscribePush } from './api/client.js'

export function pushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i)
  return out
}

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null
  return navigator.serviceWorker.register('/sw.js')
}

// İzin ister, push'a abone olur, aboneliği backend'e kaydeder. Başarılıysa true.
export async function enablePush() {
  if (!pushSupported()) {
    throw new Error('Bu cihaz/tarayıcı bildirimleri desteklemiyor. iOS’ta uygulamayı ana ekrana ekleyip oradan açman gerekir.')
  }
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Bildirim izni verilmedi.')
  }

  const reg = await navigator.serviceWorker.ready
  const { publicKey } = await getVapidPublicKey()
  if (!publicKey) throw new Error('Sunucuda bildirim anahtarı yapılandırılmamış.')

  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
  }
  await subscribePush(sub.toJSON())
  return true
}

export async function disablePush() {
  if (!('serviceWorker' in navigator)) return
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  if (sub) {
    await unsubscribePush({ endpoint: sub.endpoint }).catch(() => {})
    await sub.unsubscribe().catch(() => {})
  }
}

export async function isPushEnabled() {
  if (!pushSupported()) return false
  if (Notification.permission !== 'granted') return false
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    return !!sub
  } catch {
    return false
  }
}
