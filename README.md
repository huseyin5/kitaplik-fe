# kitaplık-fe

Zeliş'in Kütüphanesi — kişisel kitap kütüphanesi için React + Vite arayüzü.
Tek bir arama çubuğuyla kitap arar (Google Books / Open Library), beğenilen
kitapları kütüphaneye ekler ve okuma durumlarını yönetir. Giriş/üyelik yoktur;
kütüphane backend'de paylaşımlıdır. Kitap kapağı görseli kullanılmaz.

## Geliştirme

```bash
npm install
npm run dev
```

Arayüz `http://localhost:5173` adresinde çalışır. `/api` ve `/health` istekleri
Vite tarafından backend'e (varsayılan `http://localhost:3000`) proxy'lenir, böylece
geliştirmede CORS gerekmez. Backend farklı bir adresteyse:

```bash
VITE_PROXY_TARGET=http://localhost:4000 npm run dev
```

## Üretim

```bash
npm run build
```

Üretim derlemesinde API adresini `VITE_API_BASE_URL` ile verin (bkz. `.env.example`).

## Yapı

- `src/api/client.js` — backend uçlarına ince bir `fetch` sarmalayıcısı
- `src/App.jsx` — uygulama durumu ve veri akışı (arama, kütüphane, detay)
- `src/pages/` — `SearchPage`, `DetailPage`, `LibraryPage`
- `src/components/` — Header, BottomNav, Toast, ThemeToggle, BookCover, ikonlar
- `src/utils/book.js` — kapak yer tutucu rengi ve kütüphane eşleştirme yardımcıları
