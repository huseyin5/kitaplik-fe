import { STATUS_META } from '../data/books.js'
import { spineColor } from '../utils/book.js'

// The clickable cover shared by search results and library items. Shows the
// real cover image when the backend provides one, otherwise a spine + title
// placeholder coloured deterministically from the book's identity.
export default function BookCover({ book, status, onOpen, marginTopTitle }) {
  const meta = status ? STATUS_META[status] : null
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  }
  return (
    <div
      className="book-cover"
      role="button"
      tabIndex={0}
      aria-label={`${book.title} detayını aç`}
      onClick={onOpen}
      onKeyDown={onKeyDown}
    >
      {book.coverUrl ? (
        <img className="book-cover-img" src={book.coverUrl} alt="" loading="lazy" />
      ) : (
        <>
          <div className="book-spine" style={{ background: spineColor(book) }} />
          <div className="book-cover-title" style={marginTopTitle ? { marginTop: 20 } : undefined}>{book.title}</div>
          <div className="book-cover-author">{(book.authors || []).join(', ')}</div>
        </>
      )}
      {meta && <span className={`cover-status ${meta.className}`}>{meta.label}</span>}
    </div>
  )
}
