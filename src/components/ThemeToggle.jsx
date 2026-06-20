export default function ThemeToggle({ resolved, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Temayı değiştir">
      <span className="theme-knob" style={{ left: resolved === 'dark' ? '24px' : '2px' }}>
        {resolved === 'dark' ? '🌙' : '🌸'}
      </span>
    </button>
  )
}
