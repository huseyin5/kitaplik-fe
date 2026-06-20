import ThemeToggle from './ThemeToggle.jsx'

export default function Header({ onLibrary, resolved, onToggleTheme, onSearch, activeNav, username, onLogout }) {
  const initial = (username || '?').charAt(0)
  return (
    <>
      <header className="topbar show-desktop">
        <div className="topbar-left">
          <div className="brand">
            <span className="brand-emoji fx-sway">🌷</span>
            <span className="brand-name">Zeliş'in Kütüphanesi</span>
          </div>
          <nav className="nav">
            <button className={`nav-btn${activeNav === 'search' ? ' active' : ''}`} onClick={onSearch}>Ara</button>
            <button className={`nav-btn${activeNav === 'library' ? ' active' : ''}`} onClick={onLibrary}>Kütüphanem</button>
          </nav>
        </div>
        <div className="header-user">
          <span className="user-chip"><span className="user-avatar">{initial}</span>{username}</span>
          <ThemeToggle resolved={resolved} onToggle={onToggleTheme} />
          <button className="logout-btn" onClick={onLogout}>Çıkış</button>
          <span className="header-flutter fx-float">🦋</span>
        </div>
      </header>

      <header className="topbar show-mobile">
        <div className="brand">
          <span className="brand-emoji fx-sway">🌷</span>
          <span className="brand-name">Zeliş'in Kütüphanesi</span>
        </div>
        <div className="header-user">
          <span className="user-avatar">{initial}</span>
          <ThemeToggle resolved={resolved} onToggle={onToggleTheme} />
          <button className="logout-btn" onClick={onLogout}>Çıkış</button>
        </div>
      </header>
    </>
  )
}
