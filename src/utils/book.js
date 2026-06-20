// The backend does not return a cover/spine colour, so we derive a stable one
// from the book's identity to keep the placeholder covers visually varied.
const SPINE_PALETTE = ['#e85a9b', '#d6457f', '#f06595', '#c2255c', '#e64980', '#d6336c']

export function spineColor(book) {
  const key = String(book.id || book.isbn || book.title || '')
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return SPINE_PALETTE[hash % SPINE_PALETTE.length]
}

const normTitle = (t) => String(t || '').trim().toLocaleLowerCase('tr')

// Library entries don't keep the source-specific book id, so we match a search
// result to a stored book by ISBN when available, falling back to the title.
export function sameBook(a, b) {
  if (!a || !b) return false
  if (a.isbn && b.isbn) return a.isbn === b.isbn
  return normTitle(a.title) === normTitle(b.title)
}
