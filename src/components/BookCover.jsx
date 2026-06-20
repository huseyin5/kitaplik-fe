import { useEffect, useState } from 'react'
import { STATUS_META } from '../data/books.js'
import { spineColor } from '../utils/book.js'

// The clickable cover shared by search results and library items. Shows the
// real cover image when the backend provides one AND it loads successfully;
// otherwise falls back to a spine + title placeholder coloured deterministically
// from the book's identity (covers both missing and broken/404 image URLs).
export default function BookCover({ book, status, onOpen, marginTopTitle }) {
  const meta = status ? STATUS_META[status] : null
  const [imgFailed, setImgFailed] = useState(false)

  // Reset the failure flag when the underlying image changes (list reuse).
  useEffect(() => { setImgFailed(false) }, [book.coverUrl])

  const showImage = book.coverUrl && !imgFailed

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
      {showImage ? (
        <img
          className="book-cover-img"
          src={book.coverUrl}
          alt=""
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
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
