import ThemeToggle from './ThemeToggle.jsx'
import { BellIcon } from './icons.jsx'

export default function Header({
  onLibrary, resolved, onToggleTheme, onSearch, activeNav,
  notifySupported, notifyOn, onToggleNotify,
}) {
  const bell = notifySupported ? (
    <button
      className={`icon-btn${notifyOn ? ' active' : ''}`}
      onClick={onToggleNotify}
      aria-label={notifyOn ? 'Bildirimleri kapat' : 'Bildirimleri aç'}
      title={notifyOn ? 'Bildirimler açık' : 'Bildirimleri aç'}
    >
      <BellIcon off={!notifyOn} />
    </button>
  ) : null

  return (
    <>
      <header className="topbar show-desktop">
        <div className="topbar-left">
          <button className="brand brand-btn" onClick={onSearch} aria-label="Ana sayfaya git">
            <img className="brand-logo" src="/logo.svg" alt="" width="28" height="28" />
            <span className="brand-name">Zeliş'in Kütüphanesi</span>
          </button>
          <nav className="nav">
            <button className={`nav-btn${activeNav === 'search' ? ' active' : ''}`} onClick={onSearch}>Ara</button>
            <button className={`nav-btn${activeNav === 'library' ? ' active' : ''}`} onClick={onLibrary}>Kütüphanem</button>
          </nav>
        </div>
        <div className="header-user">
          {bell}
          <ThemeToggle resolved={resolved} onToggle={onToggleTheme} />
        </div>
      </header>

      <header className="topbar show-mobile">
        <button className="brand brand-btn" onClick={onSearch} aria-label="Ana sayfaya git">
          <img className="brand-logo" src="/logo.svg" alt="" width="26" height="26" />
          <span className="brand-name">Zeliş'in Kütüphanesi</span>
        </button>
        <div className="header-user">
          {bell}
          <ThemeToggle resolved={resolved} onToggle={onToggleTheme} />
        </div>
      </header>
    </>
  )
}
