import BookCover from '../components/BookCover.jsx'
import { SearchIcon } from '../components/icons.jsx'
import { STATUS_META } from '../data/books.js'

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
  query, by, loading, error, hasSearched, results, findEntry,
  history, onPickHistory, onRemoveHistory, onClearHistory,
  onQueryChange, onSearch, onSetBy, onOpen, onAdd,
}) {
  return (
    <section>
      <div className="search-hero">
        <span className="hero-petal-1 fx-sway">🌸</span>
        <span className="hero-petal-2 fx-float">🌿</span>
        <span className="hero-petal-3">🌷</span>
        <h1>Zeliş'in Kütüphanesine Hoş geldin! 🌸</h1>
        <p>Başlık veya yazara göre ara, sevdiğin kitapları çiçekli rafına ekle.</p>
      </div>

      <div className="search-col">
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
        <div className="search-controls">
          <div className="seg" role="tablist" aria-label="Arama türü">
            <button className={`seg-btn${by === 'title' ? ' active' : ''}`} onClick={() => onSetBy('title')}>Başlık</button>
            <button className={`seg-btn${by === 'author' ? ' active' : ''}`} onClick={() => onSetBy('author')}>Yazar</button>
          </div>
          <button className="btn-primary" onClick={onSearch}>Ara</button>
        </div>
      </div>

      {loading ? (
        <>
          <div className="result-count">Aranıyor…</div>
          <div className="grid-books">
            {SKELETONS.map((n) => (
              <div className="book" key={n}>
                <div className="sk" style={{ aspectRatio: '3/4', borderRadius: 14 }} />
                <div className="sk" style={{ height: 13, width: '82%' }} />
                <div className="sk" style={{ height: 11, width: '55%' }} />
                <div className="sk" style={{ height: 36, borderRadius: 999 }} />
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
            <div className="empty-emoji">🌷</div>
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
                  <BookCover book={book} status={null} onOpen={() => onOpen(book)} />
                  <div className="book-info">
                    <div className="book-info-title">{book.title}</div>
                    <div className="book-info-meta">{(book.authors || []).join(', ')}{book.publishedDate ? ` · ${book.publishedDate}` : ''}</div>
                  </div>
                  {meta ? (
                    <span className={`badge ${meta.className}`}><span className="dot" />{meta.label}</span>
                  ) : (
                    <button className="btn-add" onClick={() => onAdd(book)}>
                      <span className="flower">🌸</span>Ekle
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="empty search">
          <div className="empty-emoji">🌺</div>
          <div className="empty-title">Sonuç bulunamadı</div>
          <div className="empty-msg">“{query}” için kitap bulunamadı. Farklı bir arama dene veya arama türünü değiştir.</div>
        </div>
      )}
    </section>
  )
}
