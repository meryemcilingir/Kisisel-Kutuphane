# Kişisel Kütüphane

Angular ile geliştirilmiş kişisel kitap takip uygulaması. Okuduğunuz, okuyacağınız ve okumakta olduğunuz kitapları yönetin.

🔗 **Demo:** [kisisel-kutuphane.vercel.app](https://kisisel-kutuphane.vercel.app)  
📁 **Repo:** [github.com/meryemcilingir/Kisisel-Kutuphane](https://github.com/meryemcilingir/Kisisel-Kutuphane)

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

\`\`\`bash
# Depoyu klonla
git clone https://github.com/meryemcilingir/Kisisel-Kutuphane.git
cd Kisisel-Kutuphane

# Bağımlılıkları yükle
npm install --legacy-peer-deps

# Geliştirme sunucusunu başlat
ng serve
\`\`\`

Tarayıcıda `http://localhost:4200` adresini aç.

---

## Mimari

Proje **feature-based** mimari ile kurgulanmıştır:

\`\`\`
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
\`\`\`

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
## Proje İstatistikleri

| Kriter | Adet | Detay |
|--------|------|-------|
| Component | 8 | AppComponent, BooksListComponent, BooksFormComponent, DashboardComponent, BookDetailComponent, ConfirmDialogComponent, EmptyStateComponent, + |
| Service | 3 | BooksService, StorageService, GoogleBooksService |
| Model / Interface | 4 | Book, OkumaDurumu, Etiket, OkumaHedefi |
| Route Guard | 1 | UnsavedChangesGuard |
| Custom Validator | 2 | sayfaSayisiValidator, puanValidator |
| Custom Pipe | 1 | DurumEtiketPipe |
| Custom Directive | 1 | DurumRozetDirective |

## Özel Yapı Taşları

- **Custom Pipe:** `DurumEtiketPipe` — `'okunacak'` → `'Okunacak'` dönüşümü (`shared/pipes/durum-etiket-pipe.ts`)
- **Custom Directive:** `DurumRozetDirective` — Okuma durumuna göre rozet rengi (`shared/directives/durum-rozet.ts`)
- **Custom Validator:** `sayfaSayisiValidator`, `puanValidator` — Form doğrulama (`shared/validators/kitap-validator.ts`)
- **Route Guard:** `UnsavedChangesGuard` — Formdan kaydetmeden çıkınca uyarı (`core/guards/unsaved-changes-guard.ts`)

---

## Ekran Görüntüleri

<img width="1883" height="1017" alt="Ana Sayfa" src="https://github.com/user-attachments/assets/d5878104-6ea7-4abf-beea-82db3b5b1ed7" />
<img width="972" height="1020" alt="Kitap Ekleme" src="https://github.com/user-attachments/assets/036cf952-204e-4994-a445-404aff687273" />
<img width="1902" height="1021" alt="İstatistikler" src="https://github.com/user-attachments/assets/7a5c5186-cf65-448e-9858-e7c76e1e35db" />
<img width="1918" height="1007" alt="Menü" src="https://github.com/user-attachments/assets/2fc6caaa-0c90-4398-b4cf-8187580208a1" />
<img width="1887" height="1007" alt="Kanban Board" src="https://github.com/user-attachments/assets/d1727758-fbd0-4f7d-800c-30a0d00773c6" />



---

## Geliştirici

**Meryem Çilingir** — Staj Projesi, 2026
