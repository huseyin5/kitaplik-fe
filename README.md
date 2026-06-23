# kitaplık-fe

Zeliş'in Kütüphanesi — tamamen tarayıcıda çalışan kişisel kitap rafı (React + Vite).
Giriş/üyelik veya backend yoktur: arama yerel kitap kataloğunu filtreler, kütüphane
`localStorage`'da saklanır.

## Geliştirme

```bash
npm install
npm run dev
```

Arayüz `http://localhost:5173` adresinde çalışır.

## Üretim

```bash
npm run build
```

## Yapı

- `src/App.jsx` — uygulama durumu ve veri akışı (arama, kütüphane, detay)
- `src/data/books.js` — yerel kitap kataloğu ve okuma durumu meta verileri
- `src/pages/` — `SearchPage`, `DetailPage`, `LibraryPage`
- `src/components/` — Header, BottomNav, Toast, ThemeToggle, BookCover, ikonlar
- `src/utils/book.js` — kapak yer tutucu rengi ve kütüphane eşleştirme yardımcıları
