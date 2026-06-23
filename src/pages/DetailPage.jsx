import { STATUS_META } from '../data/books.js'

const dash = (v) => (v == null || v === '' ? '—' : v)

export default function DetailPage({ book, status, loading, onBack, onAdd }) {
  if (!book) return null
  const meta = status ? STATUS_META[status] : null
  return (
    <section>
      <button className="back-btn" onClick={onBack}><span className="chev">‹</span>Geri</button>
      <div className="detail-main">
        <div>
          <h1 className="detail-title">{book.title}</h1>
          <div className="detail-author">{dash((book.authors || []).join(', '))}</div>
        </div>
        <div className="detail-grid">
          <span className="label">Yayınevi</span><span>{dash(book.publisher)}</span>
          <span className="label">Yıl</span><span>{dash(book.publishedDate)}</span>
          <span className="label">Sayfa</span><span>{book.pageCount ? `${book.pageCount} sayfa` : '—'}</span>
          <span className="label">ISBN</span><span>{dash(book.isbn)}</span>
        </div>
        <div>
          {meta ? (
            <div className="detail-status">
              <span className={`pill ${meta.className}`}><span className="dot" />{meta.label}</span>
              <span className="note">Kütüphanende</span>
            </div>
          ) : (
            <button className="btn-add-lg" onClick={() => onAdd(book)}>Kütüphaneme ekle</button>
          )}
        </div>
        {book.description ? (
          <p className="detail-desc">{book.description}</p>
        ) : loading ? (
          <p className="detail-desc" style={{ color: 'var(--muted)' }}>Açıklama yükleniyor…</p>
        ) : null}
      </div>
    </section>
  )
}
