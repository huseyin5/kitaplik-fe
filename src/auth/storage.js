// Persists the logged-in session ({ token, user }) in localStorage so the user
// stays signed in across reloads.
const KEY = 'kitaplik.auth'

export function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch {
    return null
  }
}

export function saveAuth(auth) {
  localStorage.setItem(KEY, JSON.stringify(auth))
}

export function clearAuth() {
  localStorage.removeItem(KEY)
}
