import { SearchIcon, LibraryIcon } from './icons.jsx'

export default function BottomNav({ activeNav, onSearch, onLibrary }) {
  return (
    <nav className="bottom-nav show-mobile" aria-label="Ana gezinme">
      <button className={`bottom-nav-btn${activeNav === 'search' ? ' active' : ''}`} onClick={onSearch}>
        <SearchIcon size={22} />
        Ara
      </button>
      <button className={`bottom-nav-btn${activeNav === 'library' ? ' active' : ''}`} onClick={onLibrary}>
        <LibraryIcon size={22} />
        Kütüphanem
      </button>
    </nav>
  )
}
