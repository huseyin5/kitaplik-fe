import BookCover from '../components/BookCover.jsx'
import { SearchIcon } from '../components/icons.jsx'
import { STATUS_META } from '../data/books.js'

const SKELETONS = [1, 2, 3, 4, 5, 6, 7, 8]

export default function SearchPage({
  query, by, loading, error, hasSearched, results, findEntry,
  onQueryChange, onSearch, onSetBy, onOpen, onAdd,
}) {
  return (
    <section>
      <h1 className="page-title">Kitap Ara</h1>
      <p className="page-sub">Başlık veya yazara göre ara, beğendiğini kütüphanene ekle.</p>

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
        <div className="seg" role="tablist" aria-label="Arama türü">
          <button className={`seg-btn${by === 'title' ? ' active' : ''}`} onClick={() => onSetBy('title')}>Başlık</button>
          <button className={`seg-btn${by === 'author' ? ' active' : ''}`} onClick={() => onSetBy('author')}>Yazar</button>
        </div>
        <button className="btn-primary" onClick={onSearch}>Ara</button>
      </div>

      {loading ? (
        <>
          <div className="result-count">Aranıyor…</div>
          <div className="grid-books">
            {SKELETONS.map((n) => (
              <div className="book" key={n}>
                <div className="sk" style={{ aspectRatio: '3/4', borderRadius: 11 }} />
                <div className="sk" style={{ height: 13, width: '82%' }} />
                <div className="sk" style={{ height: 11, width: '55%' }} />
                <div className="sk" style={{ height: 32, borderRadius: 8 }} />
              </div>
            ))}
          </div>
        </>
      ) : error ? (
        <div className="empty search">
          <div className="empty-icon"><SearchIcon size={24} /></div>
          <div className="empty-title">Arama yapılamadı</div>
          <div className="empty-msg">{error}</div>
          <button className="btn-ghost" onClick={onSearch}>Tekrar dene</button>
        </div>
      ) : !hasSearched ? (
        <div className="empty search">
          <div className="empty-icon"><SearchIcon size={24} /></div>
          <div className="empty-title">Aramaya başla</div>
          <div className="empty-msg">Bir kitap adı veya yazar yazıp “Ara” de; sonuçlar burada listelenecek.</div>
        </div>
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
                      <span className="plus">+</span>Kütüphaneme ekle
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="empty search">
          <div className="empty-icon"><SearchIcon size={24} /></div>
          <div className="empty-title">Sonuç bulunamadı</div>
          <div className="empty-msg">“{query}” için kitap bulunamadı. Farklı bir arama dene veya arama türünü değiştir.</div>
        </div>
      )}
    </section>
  )
}
