import { useMemo, useState } from 'react'
import { SearchIcon } from '../components/icons.jsx'
import { STATUS_META, STATUS_ORDER } from '../data/books.js'
import { spineColor } from '../utils/book.js'

const FILTERS = [
  { key: 'all', label: 'Tümü' },
  { key: 'okunacak', label: 'Okunacak' },
  { key: 'okunuyor', label: 'Okunuyor' },
  { key: 'okundu', label: 'Okundu' },
]

const EMPTY_COPY = {
  all: { title: 'Kütüphanen henüz boş', msg: 'Arama sayfasından kitap bulup “Kütüphaneme ekle” diyerek listeni oluşturmaya başla.' },
  okunacak: { title: 'Okunacak kitap yok', msg: 'Eklediğin kitaplar varsayılan olarak burada listelenir.' },
  okunuyor: { title: 'Şu an okuduğun kitap yok', msg: 'Bir kitabın durumunu “Okunuyor” yaparak buraya taşıyabilirsin.' },
  okundu: { title: 'Henüz bitirdiğin kitap yok', msg: 'Okumayı tamamladığın kitaplar burada birikecek.' },
}

const SKELETONS = [1, 2, 3, 4]

export default function LibraryPage({
  filter, counts, items, loading, error, onRetry,
  onSetFilter, onOpen, onStatusChange, onRemove, onGoSearch,
}) {
  const [q, setQ] = useState('')

  // Filter the (already status-filtered) list by title/author locally.
  const visible = useMemo(() => {
    const term = q.trim().toLocaleLowerCase('tr')
    if (!term) return items
    return items.filter((b) =>
      b.title.toLocaleLowerCase('tr').includes(term) ||
      (b.authors || []).join(', ').toLocaleLowerCase('tr').includes(term))
  }, [items, q])

  const empty = EMPTY_COPY[filter] || EMPTY_COPY.all
  return (
    <section>
      <h1 className="page-title">Kütüphanem</h1>

      <div className="search-row">
        <div className="search-input-wrap">
          <span className="search-icon"><SearchIcon /></span>
          <input
            className="search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kütüphanende ara…"
            aria-label="Kütüphanende ara"
          />
        </div>
      </div>

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
              <div className="book-main">
                <div className="sk" style={{ height: 15, width: '80%' }} />
                <div className="sk" style={{ height: 12, width: '55%' }} />
              </div>
              <div className="book-foot">
                <div className="sk" style={{ height: 40, borderRadius: 10 }} />
              </div>
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
          <div className="empty-emoji">📚</div>
          <div className="empty-title">{empty.title}</div>
          <div className="empty-msg">{empty.msg}</div>
          <button className="btn-ghost" onClick={onGoSearch}>Kitap ara</button>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <div className="empty-emoji">🔍</div>
          <div className="empty-title">Sonuç bulunamadı</div>
          <div className="empty-msg">“{q}” için kütüphanende kitap bulunamadı.</div>
        </div>
      ) : (
        <div className="grid-books">
          {visible.map((item) => {
            const meta = STATUS_META[item.status]
            return (
              <div className="book" key={item.id}>
                <button className="book-main" onClick={() => onOpen(item)} style={{ borderLeftColor: spineColor(item) }}>
                  <div className="book-title">{item.title}</div>
                  <div className="book-meta">{(item.authors || []).join(', ')}{item.publishedDate ? ` · ${item.publishedDate}` : ''}</div>
                  {meta && <span className={`badge ${meta.className}`}><span className="dot" />{meta.label}</span>}
                </button>
                <div className="book-foot lib-controls">
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
            )
          })}
        </div>
      )}
    </section>
  )
}
