# 📚 Kişisel Kütüphane

Angular ile geliştirilmiş kişisel kitap takip uygulaması. Okuduğunuz, okuyacağınız ve okumakta olduğunuz kitapları yönetin.

🔗 **Demo:** [Vercel Deploy Linki](#) *(yakında eklenecek)*  
📁 **Repo:** [github.com/KULLANICI_ADIN/kutuphane-app](#)

---

## Özellikler

- **CRUD:** Kitap ekleme, listeleme, düzenleme ve silme
- **Kanban Board:** Okunacak / Okunuyor / Okundu sütunları ile sürükle-bırak
- **Arama, Filtreleme, Sıralama:** Tür, yazar, etiket, puan, tarih ve sayfa sayısına göre
- **Open Library API:** Kitap adı yazınca kapak, sayfa sayısı ve bilgileri otomatik doldurma
- **Sayfalama:** Sayfa başına 10 / 20 / 50 kitap seçeneği
- **Okuma Hedefi:** Yıllık hedef belirleme ve ilerleme takibi
- **Streak Takibi:** Günlük okuma serisi
- **Değerlendirme:** Kitap bitince puan ve not ekleme
- **JSON Yedekleme:** Kitap verilerini dışa/içe aktarma
- **Dark Mode:** Koyu/açık tema desteği
- **Responsive:** Mobil ve masaüstü uyumlu tasarım

---

## Kurulum

```bash
# Depoyu klonla
git clone https://github.com/KULLANICI_ADIN/kutuphane-app.git
cd kutuphane-app

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
ng serve
```

Tarayıcıda `http://localhost:4200` adresini aç.

---

## Mimari

Proje **feature-based** mimari ile kurgulanmıştır:

```
src/app/
├── core/
│   ├── models/          # Book arayüzü ve tip tanımları
│   ├── services/        # StorageService (localStorage tek erişim noktası)
│   └── guards/          # UnsavedChangesGuard
├── shared/
│   ├── components/      # ConfirmDialog, EmptyState, BookDetail
│   ├── pipes/           # DurumEtiketPipe
│   ├── directives/      # DurumRozetDirective
│   └── validators/      # kitapValidator, sayfaSayisiValidator
└── features/
    └── books/
        ├── services/    # BooksService, GoogleBooksService
        └── pages/
            ├── books-list/   # Ana sayfa (kanban, filtre, arama)
            ├── books-form/   # Kitap ekleme/düzenleme formu
            └── dashboard/    # İstatistikler ve grafikler
```

---

## Teknik Detaylar

| Teknoloji | Kullanım |
|-----------|----------|
| Angular 22 | Standalone components, Signals, Zoneless |
| Angular Material | UI bileşenleri |
| Angular CDK | Drag & Drop (kanban board) |
| RxJS | Servis katmanı |
| ng2-charts | İstatistik grafikleri |
| Open Library API | Kitap bilgisi çekme |
| localStorage | Veri saklama (yalnızca StorageService üzerinden) |
| SCSS | Stil, dark mode |

---

## Özel Yapı Taşları

- **Custom Pipe:** `DurumEtiketPipe` — `'okunacak'` → `'Okunacak'` dönüşümü (`shared/pipes/durum-etiket-pipe.ts`)
- **Custom Directive:** `DurumRozetDirective` — Okuma durumuna göre rozet rengi (`shared/directives/durum-rozet.ts`)
- **Custom Validator:** `sayfaSayisiValidator`, `puanValidator` — Form doğrulama (`shared/validators/kitap-validator.ts`)
- **Route Guard:** `UnsavedChangesGuard` — Formdan kaydetmeden çıkınca uyarı (`core/guards/unsaved-changes-guard.ts`)

---

## Ekran Görüntüleri

> *(Eklenecek)*

---

## Geliştirici

**Meryem Çilingir** — Staj Projesi, 2026