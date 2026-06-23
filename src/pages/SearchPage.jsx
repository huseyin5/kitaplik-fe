import { SearchIcon } from '../components/icons.jsx'
import { STATUS_META } from '../data/books.js'
import { spineColor } from '../utils/book.js'

const SKELETONS = [1, 2, 3, 4, 5, 6, 7, 8]

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export default function SearchPage({
  query, loading, error, hasSearched, results, findEntry,
  history, onPickHistory, onRemoveHistory, onClearHistory,
  onQueryChange, onSearch, onOpen, onAdd,
}) {
  return (
    <section>
      <h1 className="page-title">Kitap Ara</h1>
      <p className="page-sub">Kitap adı veya yazara göre ara, beğendiğini kütüphanene ekle.</p>

      <div className="search-row">
        <div className="search-input-wrap">
          <span className="search-icon"><SearchIcon /></span>
          <input
            className="search-input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
            placeholder="Kitap adı veya yazar ara…"
            aria-label="Kitap ara"
          />
        </div>
        <button className="btn-primary" onClick={onSearch}>Ara</button>
      </div>

      {loading ? (
        <>
          <div className="result-count">Aranıyor…</div>
          <div className="grid-books">
            {SKELETONS.map((n) => (
              <div className="book" key={n}>
                <div className="book-main">
                  <div className="sk" style={{ height: 15, width: '85%' }} />
                  <div className="sk" style={{ height: 12, width: '55%' }} />
                </div>
                <div className="book-foot">
                  <div className="sk" style={{ height: 38, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : error ? (
        <div className="empty search">
          <div className="empty-emoji">🥀</div>
          <div className="empty-title">Arama yapılamadı</div>
          <div className="empty-msg">{error}</div>
          <button className="btn-ghost" onClick={onSearch}>Tekrar dene</button>
        </div>
      ) : !hasSearched ? (
        history && history.length > 0 ? (
          <div className="history">
            <div className="history-head">
              <span className="history-title">Son aramalar</span>
              <button className="history-clear" onClick={onClearHistory}>Temizle</button>
            </div>
            <div className="history-list">
              {history.map((term) => (
                <span className="history-chip" key={term}>
                  <button
                    className="history-chip-main"
                    onClick={() => onPickHistory(term)}
                    style={{ border: 'none', background: 'none', color: 'inherit', font: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, padding: 0 }}
                  >
                    <span className="clock"><ClockIcon /></span>{term}
                  </button>
                  <button
                    className="history-remove"
                    aria-label={`${term} aramasını geçmişten kaldır`}
                    onClick={() => onRemoveHistory(term)}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty search">
            <div className="empty-emoji">🔍</div>
            <div className="empty-title">Aramaya başla</div>
            <div className="empty-msg">Bir kitap adı veya yazar yazmaya başla; sonuçlar sen yazdıkça burada listelenecek.</div>
          </div>
        )
      ) : results.length > 0 ? (
        <>
          <div className="result-count">{results.length} sonuç</div>
          <div className="grid-books">
            {results.map((book) => {
              const entry = findEntry(book)
              const meta = entry ? STATUS_META[entry.status] : null
              return (
                <div className="book" key={`${book.source}:${book.id}`}>
                  <button className="book-main" onClick={() => onOpen(book)} style={{ borderLeftColor: spineColor(book) }}>
                    <div className="book-title">{book.title}</div>
                    <div className="book-meta">{(book.authors || []).join(', ')}{book.publishedDate ? ` · ${book.publishedDate}` : ''}</div>
                  </button>
                  <div className="book-foot">
                    {meta ? (
                      <span className={`badge ${meta.className}`}><span className="dot" />{meta.label}</span>
                    ) : (
                      <button className="btn-add" onClick={() => onAdd(book)}>Ekle</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="empty search">
          <div className="empty-emoji">🔍</div>
          <div className="empty-title">Sonuç bulunamadı</div>
          <div className="empty-msg">“{query}” için kitap bulunamadı. Farklı bir arama dene.</div>
        </div>
      )}
    </section>
  )
}
