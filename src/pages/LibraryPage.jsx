import BookCover from '../components/BookCover.jsx'
import { STATUS_META, STATUS_ORDER } from '../data/books.js'

const FILTERS = [
  { key: 'all', label: 'Tümü' },
  { key: 'okunacak', label: 'Okunacak' },
  { key: 'okunuyor', label: 'Okunuyor' },
  { key: 'okundu', label: 'Okundu' },
]

const EMPTY_COPY = {
  all: { emoji: '🌱', title: 'Rafın henüz boş', msg: 'Arama sayfasından kitap bulup “Kütüphaneme ekle” diyerek rafını oluşturmaya başla.' },
  okunacak: { emoji: '🌷', title: 'Okunacak kitap yok', msg: 'Eklediğin kitaplar varsayılan olarak burada listelenir.' },
  okunuyor: { emoji: '📖', title: 'Şu an okuduğun kitap yok', msg: 'Bir kitabın durumunu “Okunuyor” yaparak buraya taşıyabilirsin.' },
  okundu: { emoji: '🌸', title: 'Henüz bitirdiğin kitap yok', msg: 'Okumayı tamamladığın kitaplar burada birikecek.' },
}

const SKELETONS = [1, 2, 3, 4]

export default function LibraryPage({
  filter, counts, items, loading, error, onRetry,
  onSetFilter, onOpen, onStatusChange, onRemove, onGoSearch,
}) {
  const empty = EMPTY_COPY[filter] || EMPTY_COPY.all
  return (
    <section>
      <h1 className="page-title">Zeliş'in Rafı <span className="title-flower">🌸</span></h1>
      <div className="chips">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`chip${filter === f.key ? ' active' : ''}`}
            onClick={() => onSetFilter(f.key)}
          >
            {f.label} <span className="count">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid-books">
          {SKELETONS.map((n) => (
            <div className="book" key={n}>
              <div className="sk" style={{ aspectRatio: '3/4', borderRadius: 14 }} />
              <div className="sk" style={{ height: 12, width: '60%' }} />
              <div className="sk" style={{ height: 40, borderRadius: 10 }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="empty">
          <div className="empty-emoji">🥀</div>
          <div className="empty-title">Kütüphane yüklenemedi</div>
          <div className="empty-msg">{error}</div>
          <button className="btn-ghost" onClick={onRetry}>Tekrar dene</button>
        </div>
      ) : items.length === 0 ? (
        <div className="empty">
          <div className="empty-emoji">{empty.emoji}</div>
          <div className="empty-title">{empty.title}</div>
          <div className="empty-msg">{empty.msg}</div>
          <button className="btn-ghost" onClick={onGoSearch}>Kitap ara 🌸</button>
        </div>
      ) : (
        <div className="grid-books">
          {items.map((item) => (
            <div className="book" key={item.id}>
              <BookCover book={item} status={item.status} onOpen={() => onOpen(item)} marginTopTitle />
              <div className="book-meta-line">{(item.authors || []).join(', ')}{item.publishedDate ? ` · ${item.publishedDate}` : ''}</div>
              <div className="lib-controls">
                <select
                  className="lib-select"
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  aria-label="Durumu değiştir"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </select>
                <button className="btn-remove" onClick={() => onRemove(item.id)} aria-label="Kütüphaneden sil">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
