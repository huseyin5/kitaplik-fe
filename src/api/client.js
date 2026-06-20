// Thin wrapper around the Kitaplık backend API.
//
// In development, requests use same-origin relative paths and Vite proxies
// /api + /health to the backend (see vite.config.js). In production, set
// VITE_API_BASE_URL to the API origin, e.g. https://api.example.com
const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (res.status === 204) return null

  let data = null
  try {
    data = await res.json()
  } catch {
    // Non-JSON or empty body — leave data as null.
  }

  if (!res.ok) {
    const message = (data && data.error) || `İstek başarısız (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.details = data && data.details
    throw err
  }
  return data
}

export function searchBooks({ q, by, limit = 20, signal } = {}) {
  const params = new URLSearchParams({ q })
  if (by) params.set('by', by)
  if (limit) params.set('limit', String(limit))
  return request(`/api/books/search?${params.toString()}`, { signal })
}

export function getBookDetail(source, id, signal) {
  return request(`/api/books/${source}/${encodeURIComponent(id)}`, { signal })
}

export function getLibrary(status, signal) {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.set('status', status)
  const qs = params.toString()
  return request(`/api/library${qs ? `?${qs}` : ''}`, { signal })
}

export function addLibraryBook(book) {
  return request('/api/library', { method: 'POST', body: JSON.stringify(book) })
}

export function updateLibraryStatus(id, status) {
  return request(`/api/library/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export function deleteLibraryBook(id) {
  return request(`/api/library/${id}`, { method: 'DELETE' })
}

export function getHealth() {
  return request('/health')
}
