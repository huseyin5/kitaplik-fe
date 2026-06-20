import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Toast from './components/Toast.jsx'
import SearchPage from './pages/SearchPage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import { useTheme } from './hooks/useTheme.js'
import { sameBook } from './utils/book.js'
import {
  searchBooks,
  getBookDetail,
  getLibrary,
  addLibraryBook,
  updateLibraryStatus,
  deleteLibraryBook,
} from './api/client.js'

// Fields the backend accepts when adding a book to the library (AddLibraryBook).
function toAddPayload(book, status) {
  return {
    title: book.title,
    authors: book.authors || [],
    isbn: book.isbn ?? null,
    coverUrl: book.coverUrl ?? null,
    publisher: book.publisher ?? null,
    publishedDate: book.publishedDate ?? null,
    description: book.description ?? null,
    pageCount: book.pageCount ?? null,
    source: book.source,
    status,
  }
}

export default function App() {
  const { resolved, toggle } = useTheme()

  const [route, setRoute] = useState('search')
  const [selectedFrom, setSelectedFrom] = useState('search')
  const [toast, setToast] = useState(null)

  // Search state
  const [query, setQuery] = useState('')
  const [by, setBy] = useState('title')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Library state
  const [library, setLibrary] = useState([])
  const [libLoading, setLibLoading] = useState(true)
  const [libError, setLibError] = useState(null)
  const [libFilter, setLibFilter] = useState('all')

  // Detail state
  const [selectedBook, setSelectedBook] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const toastTimer = useRef(null)
  const searchAbort = useRef(null)
  const detailToken = useRef(0)

  useEffect(() => () => {
    clearTimeout(toastTimer.current)
    if (searchAbort.current) searchAbort.current.abort()
  }, [])

  const showToast = useCallback((msg) => {
    setToast({ msg })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }, [])

  // ---- Library loading ----
  const refreshLibrary = useCallback(async () => {
    setLibLoading(true)
    setLibError(null)
    try {
      const data = await getLibrary()
      setLibrary(data?.books || [])
    } catch (e) {
      setLibError(e.message)
    } finally {
      setLibLoading(false)
    }
  }, [])

  useEffect(() => { refreshLibrary() }, [refreshLibrary])

  const findEntry = useCallback((book) => library.find((l) => sameBook(l, book)) || null, [library])

  // ---- Search ----
  const doSearch = useCallback(async () => {
    const q = query.trim()
    if (searchAbort.current) searchAbort.current.abort()
    if (!q) {
      setSearchResults([])
      setHasSearched(false)
      setSearchError(null)
      setSearchLoading(false)
      return
    }
    const controller = new AbortController()
    searchAbort.current = controller
    setSearchLoading(true)
    setSearchError(null)
    setHasSearched(true)
    try {
      const data = await searchBooks({ q, by, limit: 20, signal: controller.signal })
      setSearchResults(data?.results || [])
    } catch (e) {
      if (e.name === 'AbortError') return
      setSearchError(e.message)
      setSearchResults([])
    } finally {
      if (searchAbort.current === controller) {
        searchAbort.current = null
        setSearchLoading(false)
      }
    }
  }, [query, by])

  // ---- Mutations ----
  const addToLibrary = useCallback(async (book) => {
    if (findEntry(book)) {
      showToast('Bu kitap zaten kütüphanende')
      return
    }
    try {
      const created = await addLibraryBook(toAddPayload(book, 'okunacak'))
      setLibrary((prev) => [created, ...prev])
      showToast('“' + book.title + '” kütüphanene eklendi')
    } catch (e) {
      showToast(e.message)
    }
  }, [findEntry, showToast])

  const setStatus = useCallback(async (id, status) => {
    const previous = library
    setLibrary((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      const updated = await updateLibraryStatus(id, status)
      setLibrary((prev) => prev.map((l) => (l.id === id ? updated : l)))
    } catch (e) {
      setLibrary(previous)
      showToast(e.message)
    }
  }, [library, showToast])

  const removeFromLibrary = useCallback(async (id) => {
    const previous = library
    setLibrary((prev) => prev.filter((l) => l.id !== id))
    try {
      await deleteLibraryBook(id)
      showToast('Kitap kütüphanenden kaldırıldı')
    } catch (e) {
      setLibrary(previous)
      showToast(e.message)
    }
  }, [library, showToast])

  // ---- Navigation ----
  const goSearch = useCallback(() => setRoute('search'), [])
  const goLibrary = useCallback(() => setRoute('library'), [])
  const goBack = useCallback(() => setRoute(selectedFrom || 'search'), [selectedFrom])

  const openBook = useCallback((book, from) => {
    setSelectedBook(book)
    setSelectedFrom(from)
    setRoute('detail')
    // Enrich from the detail endpoint when we have a source-specific id
    // (search results); library books already carry full data.
    if (from === 'search' && book.source && book.id) {
      const token = (detailToken.current += 1)
      setDetailLoading(true)
      getBookDetail(book.source, book.id)
        .then((detail) => { if (detailToken.current === token && detail) setSelectedBook(detail) })
        .catch(() => { /* keep the list item we already have */ })
        .finally(() => { if (detailToken.current === token) setDetailLoading(false) })
    } else {
      setDetailLoading(false)
    }
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
              loading={searchLoading}
              error={searchError}
              hasSearched={hasSearched}
              results={searchResults}
              findEntry={findEntry}
              onQueryChange={setQuery}
              onSearch={doSearch}
              onSetBy={setBy}
              onOpen={(book) => openBook(book, 'search')}
              onAdd={addToLibrary}
            />
          )}

          {route === 'detail' && (
            <DetailPage
              book={selectedBook}
              status={selectedStatus}
              loading={detailLoading}
              onBack={goBack}
              onAdd={addToLibrary}
            />
          )}

          {route === 'library' && (
            <LibraryPage
              filter={libFilter}
              counts={counts}
              items={libItems}
              loading={libLoading}
              error={libError}
              onRetry={refreshLibrary}
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
