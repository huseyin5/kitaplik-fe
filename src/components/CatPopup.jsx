// Bildirime tıklayınca (veya test için) ana ekranda çıkan kedili mesaj kutusu.
const MESSAGES = {
  morning: { title: 'Günaydın! ☀️', body: 'Yeni bir güne çiçek gibi başla. Bugün sevdiğin bir kitaba bir göz at olur mu? 🐱📖' },
  night: { title: 'İyi geceler! 🌙', body: 'Gözlerini dinlendirme vakti. Yarın kaldığın sayfadan devam ederiz. 🐱💤' },
  default: { title: 'Selam! 🐱', body: 'Zeliş’in Kütüphanesi seni özledi — bugün ne okuyoruz?' },
}

export default function CatPopup({ slot, onClose }) {
  if (!slot) return null
  const msg = MESSAGES[slot] || MESSAGES.default
  return (
    <div className="cat-overlay" role="dialog" aria-modal="true" aria-label={msg.title} onClick={onClose}>
      <div className="cat-card" onClick={(e) => e.stopPropagation()}>
        <img className="cat-img" src="/cat.svg" alt="" width="120" height="120" />
        <h2 className="cat-title">{msg.title}</h2>
        <p className="cat-body">{msg.body}</p>
        <button className="btn-primary cat-close" onClick={onClose}>Teşekkürler 🌸</button>
      </div>
    </div>
  )
}
