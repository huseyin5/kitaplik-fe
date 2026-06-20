import { useCallback, useState } from 'react'

// Keeps the most recent search terms (deduped, newest first) in localStorage so
// they can be shown when the search box is empty.
const KEY = 'kitaplik.searchHistory'
const MAX = 8

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState(load)

  const persist = useCallback((next) => {
    setHistory(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // Storage unavailable (private mode etc.) — keep in-memory only.
    }
  }, [])

  const add = useCallback((rawTerm) => {
    const term = (rawTerm || '').trim()
    if (term.length < 2) return
    setHistory((prev) => {
      const next = [term, ...prev.filter((t) => t.toLocaleLowerCase('tr') !== term.toLocaleLowerCase('tr'))].slice(0, MAX)
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const remove = useCallback((term) => {
    setHistory((prev) => {
      const next = prev.filter((t) => t !== term)
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const clear = useCallback(() => persist([]), [persist])

  return { history, add, remove, clear }
}
