// Reading-status metadata shared by badges, pills and filters. Status values
// match the backend's ReadingStatus enum.
export const STATUS_META = {
  okunacak: { label: 'Okunacak', className: 'st-okunacak' },
  okunuyor: { label: 'Okunuyor', className: 'st-okunuyor' },
  okundu: { label: 'Okundu', className: 'st-okundu' },
}

export const STATUS_ORDER = ['okunacak', 'okunuyor', 'okundu']
