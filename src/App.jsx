import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Toast from './components/Toast.jsx'
import SearchPage from './pages/SearchPage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import { useTheme } from './hooks/useTheme.js'
import { useSearchHistory } from './hooks/useSearchHistory.js'
import { sameBook } from './utils/book.js'
import { CATALOG } from './data/books.js'

// The whole app runs in the browser: search filters the local catalog and the
// library is persisted in localStorage. No accounts, no backend.
const LIB_KEY = 'kitaplik.library'

function loadLibrary() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LIB_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const { resolved, toggle } = useTheme()
  const { history, add: addHistory, remove: removeHistory, clear: clearHistory } = useSearchHistory()

  const [route, setRoute] = useState('search')
  const [selectedFrom, setSelectedFrom] = useState('search')
  const [toast, setToast] = useState(null)

  // Search state
  const [query, setQuery] = useState('')
  const [by, setBy] = useState('title')

  // Library state (persisted)
  const [library, setLibrary] = useState(loadLibrary)
  const [libFilter, setLibFilter] = useState('all')

  // Detail state
  const [selectedBook, setSelectedBook] = useState(null)

  const toastTimer = useRef(null)
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // Keep the library in localStorage.
  useEffect(() => {
    try { localStorage.setItem(LIB_KEY, JSON.stringify(library)) } catch { /* storage unavailable */ }
  }, [library])

  const showToast = useCallback((msg) => {
    setToast({ msg })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }, [])

  const findEntry = useCallback((book) => library.find((l) => sameBook(l, book)) || null, [library])

  // ---- Search (local filter) ----
  const trimmed = query.trim()
  const hasSearched = trimmed.length >= 2
  const results = useMemo(() => {
    const q = trimmed.toLocaleLowerCase('tr')
    if (q.length < 2) return []
    return CATALOG.filter((b) => (by === 'author'
      ? (b.authors || []).join(', ').toLocaleLowerCase('tr').includes(q)
      : b.title.toLocaleLowerCase('tr').includes(q)))
  }, [trimmed, by])

  const submitSearch = useCallback(() => { addHistory(query) }, [query, addHistory])
  const pickHistory = useCallback((term) => { setQuery(term); addHistory(term) }, [addHistory])

  // ---- Mutations ----
  const addToLibrary = useCallback((book) => {
    if (findEntry(book)) {
      showToast('Bu kitap zaten rafında')
      return
    }
    const entry = { ...book, id: book.id || `l_${Date.now()}`, status: 'okunacak', addedAt: Date.now() }
    setLibrary((prev) => [entry, ...prev])
    showToast('“' + book.title + '” rafına eklendi')
  }, [findEntry, showToast])

  const setStatus = useCallback((id, status) => {
    setLibrary((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }, [])

  const removeFromLibrary = useCallback((id) => {
    setLibrary((prev) => prev.filter((l) => l.id !== id))
    showToast('Kitap rafından kaldırıldı')
  }, [showToast])

  // ---- Navigation ----
  const goSearch = useCallback(() => setRoute('search'), [])
  const goLibrary = useCallback(() => setRoute('library'), [])
  const goBack = useCallback(() => setRoute(selectedFrom || 'search'), [selectedFrom])

  const openBook = useCallback((book, from) => {
    setSelectedBook(book)
    setSelectedFrom(from)
    setRoute('detail')
  }, [])

  // ---- Derived ----
  const counts = useMemo(() => {
    const c = { all: library.length, okunacak: 0, okunuyor: 0, okundu: 0 }
    library.forEach((l) => { if (c[l.status] !== undefined) c[l.status] += 1 })
    return c
  }, [library])

  const libItems = useMemo(
    () => (libFilter === 'all' ? library : library.filter((l) => l.status === libFilter)),
    [library, libFilter],
  )

  const selectedStatus = selectedBook ? (findEntry(selectedBook)?.status ?? null) : null

  const onLibrarySide = route === 'library' || (route === 'detail' && selectedFrom === 'library')
  const activeNav = onLibrarySide ? 'library' : 'search'

  return (
    <div className="app" data-theme={resolved}>
      <Toast message={toast?.msg} />

      <Header
        activeNav={activeNav}
        resolved={resolved}
        onToggleTheme={toggle}
        onSearch={goSearch}
        onLibrary={goLibrary}
      />

      <main className="main-pad">
        <div className="main-inner">
          {route === 'search' && (
            <SearchPage
              query={query}
              by={by}
              hasSearched={hasSearched}
              results={results}
              findEntry={findEntry}
              history={history}
              onPickHistory={pickHistory}
              onRemoveHistory={removeHistory}
              onClearHistory={clearHistory}
              onQueryChange={setQuery}
              onSearch={submitSearch}
              onSetBy={setBy}
              onOpen={(book) => { addHistory(query); openBook(book, 'search') }}
              onAdd={addToLibrary}
            />
          )}

          {route === 'detail' && (
            <DetailPage
              book={selectedBook}
              status={selectedStatus}
              onBack={goBack}
              onAdd={addToLibrary}
            />
          )}

          {route === 'library' && (
            <LibraryPage
              filter={libFilter}
              counts={counts}
              items={libItems}
              onSetFilter={setLibFilter}
              onOpen={(book) => openBook(book, 'library')}
              onStatusChange={setStatus}
              onRemove={removeFromLibrary}
              onGoSearch={goSearch}
            />
          )}
        </div>
      </main>

      <BottomNav activeNav={activeNav} onSearch={goSearch} onLibrary={goLibrary} />
    </div>
  )
}
