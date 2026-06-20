import ThemeToggle from './ThemeToggle.jsx'

export default function Header({ onLibrary, resolved, onToggleTheme, onSearch, activeNav }) {
  return (
    <>
      <header className="topbar show-desktop">
        <div className="topbar-left">
          <div className="brand">
            <span className="brand-dot" />
            <span className="brand-name">Kitaplık</span>
          </div>
          <nav className="nav">
            <button className={`nav-btn${activeNav === 'search' ? ' active' : ''}`} onClick={onSearch}>Ara</button>
            <button className={`nav-btn${activeNav === 'library' ? ' active' : ''}`} onClick={onLibrary}>Kütüphanem</button>
          </nav>
        </div>
        <ThemeToggle resolved={resolved} onToggle={onToggleTheme} />
      </header>

      <header className="topbar show-mobile">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">Kitaplık</span>
        </div>
        <ThemeToggle resolved={resolved} onToggle={onToggleTheme} />
      </header>
    </>
  )
}
