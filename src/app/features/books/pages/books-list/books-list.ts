import { Component, inject, signal, computed, OnInit, HostListener, ElementRef, effect, untracked } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BooksService } from '../../services/books';
import { DurumEtiketPipe } from '../../../../shared/pipes/durum-etiket-pipe';
import { DurumRozetDirective } from '../../../../shared/directives/durum-rozet';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { BookDetailComponent } from '../../../../shared/components/book-detail/book-detail';
import { OkumaDurumu, Book } from '../../../../core/models/book.model';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatIconModule, MatCardModule,
    MatTooltipModule, FormsModule, NgTemplateOutlet, DragDropModule,
    DurumEtiketPipe, DurumRozetDirective, EmptyStateComponent
  ],
  templateUrl: './books-list.html',
  styleUrl: './books-list.scss'
})
export class BooksListComponent implements OnInit {
  booksService = inject(BooksService);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private elementRef = inject(ElementRef);

  aramaMetni = signal('');
  oneriGoster = signal(false);
  filtrePaneli = signal(false);
  secilenTur = signal('');
  secilenEtiket = signal('');
  secilenYazar = signal('');
  minPuan = signal(0);
  tarihFiltresi = signal('tumu');
  sayfaFiltresi = signal('tumu');
  aktifDurumFiltresi = signal('');
  hedef = signal(this.booksService.hedefGetir());
  hedefDuzenle = signal(false);
  yeniHedef = signal(12);
  siralamaPaneli = signal(false);
  siralama = signal('tarih-yeni');
  sayfaBasinaKitap = signal(10);
mevcutSayfa = signal(1);
  degerlendirmeKitabi = signal<Book | null>(null);
  degerlendirmePuan = signal<number | null>(null);
  degerlendirmeNot = '';

  private _sayfaSifirla = effect(() => {
    this.aramaMetni();
    this.secilenTur();
    this.secilenYazar();
    this.secilenEtiket();
    this.minPuan();
    this.tarihFiltresi();
    this.sayfaFiltresi();
    this.siralama();
    untracked(() => this.mevcutSayfa.set(1));
  });

  degerlendirmeKaydet() {
    const kitap = this.degerlendirmeKitabi();
    if (kitap) {
      const guncel: any = { ...kitap };
      if (this.degerlendirmePuan()) guncel.puan = this.degerlendirmePuan();
      if (this.degerlendirmeNot.trim()) guncel.not = this.degerlendirmeNot.trim();
      this.booksService.kitapGuncelle(kitap.id, guncel);
    }
    this.degerlendirmeKapat();
  }

  degerlendirmeKapat() {
    this.degerlendirmeKitabi.set(null);
    this.degerlendirmePuan.set(null);
    this.degerlendirmeNot = '';
  }

  turSecenekleri = ['Roman', 'Bilim Kurgu', 'Tarih', 'Kişisel Gelişim', 'Felsefe', 'Biyografi', 'Diğer'];
  etiketSecenekleri = ['klasik', 'favori', 'tekrar-oku', 'hediye', 'okuma-listesi'];

  yazarListesi = computed(() => {
    const yazarlar = this.booksService.kitaplar().map(k => k.yazar);
    return [...new Set(yazarlar)].sort();
  });

  aktifFiltreSayisi = computed(() => {
    let sayac = 0;
    if (this.secilenTur()) sayac++;
    if (this.secilenEtiket()) sayac++;
    if (this.secilenYazar()) sayac++;
    if (this.minPuan() > 0) sayac++;
    if (this.tarihFiltresi() !== 'tumu') sayac++;
    if (this.sayfaFiltresi() !== 'tumu') sayac++;
    return sayac;
  });

  tarihEtiket = computed(() => {
    const map: Record<string, string> = {
      bugun: 'Bugün', 'bu-hafta': 'Bu Hafta', 'bu-ay': 'Bu Ay', 'bu-yil': 'Bu Yıl'
    };
    return map[this.tarihFiltresi()] ?? '';
  });

  sayfaEtiket = computed(() => {
    const map: Record<string, string> = {
      kisa: "200'den az", orta: '200-400', uzun: "400'den fazla"
    };
    return map[this.sayfaFiltresi()] ?? '';
  });

  @HostListener('document:click', ['$event'])
disariTiklandi(event: MouseEvent) {
  const hedef = event.target as HTMLElement;

  if (this.filtrePaneli() && !hedef.closest('.filtre-panel') && !hedef.closest('.filtre-ac-btn')) {
    this.filtrePaneli.set(false);
  }

  if (this.siralamaPaneli() && !hedef.closest('.sirala-dropdown') && !hedef.closest('.sirala-wrapper')) {
    this.siralamaPaneli.set(false);
  }
}
  siralamaSec(secim: string) {
    this.siralama.set(secim);
    this.siralamaPaneli.set(false);
  }

  private siralamaUygula(liste: Book[]): Book[] {
    const sirali = [...liste];
    switch (this.siralama()) {
      case 'tarih-yeni':
        return sirali.sort((a, b) => new Date(b.eklenmeTarihi).getTime() - new Date(a.eklenmeTarihi).getTime());
      case 'tarih-eski':
        return sirali.sort((a, b) => new Date(a.eklenmeTarihi).getTime() - new Date(b.eklenmeTarihi).getTime());
      case 'puan-yuksek':
        return sirali.sort((a, b) => (b.puan ?? 0) - (a.puan ?? 0));
      case 'puan-dusuk':
        return sirali.sort((a, b) => (a.puan ?? 0) - (b.puan ?? 0));
      case 'ad-az':
        return sirali.sort((a, b) => a.ad.toLowerCase() < b.ad.toLowerCase() ? -1 : 1);
      case 'ad-za':
        return sirali.sort((a, b) => a.ad.toLowerCase() > b.ad.toLowerCase() ? -1 : 1);
      case 'sayfa-cok':
        return sirali.sort((a, b) => (b.sayfaSayisi ?? 0) - (a.sayfaSayisi ?? 0));
      default:
        return sirali;
    }
  }

  private kitapFiltrele(kitap: Book): boolean {
    const aramaUygun = this.aramaMetni() === '' ||
      kitap.ad.toLowerCase().includes(this.aramaMetni().toLowerCase()) ||
      kitap.yazar.toLowerCase().includes(this.aramaMetni().toLowerCase());
    const turUygun = this.secilenTur() === '' || kitap.tur === this.secilenTur();
    const etiketUygun = this.secilenEtiket() === '' ||
      (kitap.etiketler ?? []).includes(this.secilenEtiket() as any);
    const yazarUygun = this.secilenYazar() === '' || kitap.yazar.toLowerCase().includes(this.secilenYazar().toLowerCase());
    const puanUygun = this.minPuan() === 0 || (kitap.puan ?? 0) >= this.minPuan();

    const simdi = new Date();
    const eklenmeTarihi = new Date(kitap.eklenmeTarihi);
    let tarihUygun = true;
    if (this.tarihFiltresi() === 'bugun') {
      tarihUygun = eklenmeTarihi.toDateString() === simdi.toDateString();
    } else if (this.tarihFiltresi() === 'bu-hafta') {
      const haftaOnce = new Date(simdi); haftaOnce.setDate(simdi.getDate() - 7);
      tarihUygun = eklenmeTarihi >= haftaOnce;
    } else if (this.tarihFiltresi() === 'bu-ay') {
      tarihUygun = eklenmeTarihi.getMonth() === simdi.getMonth() &&
        eklenmeTarihi.getFullYear() === simdi.getFullYear();
    } else if (this.tarihFiltresi() === 'bu-yil') {
      tarihUygun = eklenmeTarihi.getFullYear() === simdi.getFullYear();
    }

    let sayfaUygun = true;
    if (this.sayfaFiltresi() === 'kisa') sayfaUygun = (kitap.sayfaSayisi ?? 0) < 200;
    else if (this.sayfaFiltresi() === 'orta') sayfaUygun = (kitap.sayfaSayisi ?? 0) >= 200 && (kitap.sayfaSayisi ?? 0) <= 400;
    else if (this.sayfaFiltresi() === 'uzun') sayfaUygun = (kitap.sayfaSayisi ?? 0) > 400;

    return aramaUygun && turUygun && etiketUygun && yazarUygun && puanUygun && tarihUygun && sayfaUygun;
  }

  tumKitaplar = computed(() =>
    this.siralamaUygula(this.booksService.kitaplar().filter(k => {
      const durumUygun = this.aktifDurumFiltresi() === '' ||
        this.aktifDurumFiltresi() === 'tumu' ||
        k.durum === this.aktifDurumFiltresi();
      return durumUygun && this.kitapFiltrele(k);
    }))
  );

okunacaklar = computed(() =>
  this.sayfaliKitaplar().filter(k => k.durum === 'okunacak')
);
okunanlar = computed(() =>
  this.sayfaliKitaplar().filter(k => k.durum === 'okunuyor')
);
okunanlarBitti = computed(() =>
  this.sayfaliKitaplar().filter(k => k.durum === 'okundu')
);

  tumOkunacak = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okunacak').length);
  tumOkunuyor = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okunuyor').length);
  tumOkundu = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okundu').length);
  toplamFiltrelenen = computed(() => this.okunacaklar().length + this.okunanlar().length + this.okunanlarBitti().length);

  suAnOkunanIndex = signal(0);
  bugunOkunan = signal(this.booksService.bugunOkunanSayfa());
  streak = signal(this.booksService.streakHesapla());
  suAnOkunanListesi = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okunuyor'));

  suAnOkunan = computed(() => {
    const liste = this.suAnOkunanListesi();
    if (liste.length === 0) return undefined;
    const index = Math.min(this.suAnOkunanIndex(), liste.length - 1);
    return liste[index];
  });

  suAnOnceki() {
    const liste = this.suAnOkunanListesi();
    this.suAnOkunanIndex.set((this.suAnOkunanIndex() - 1 + liste.length) % liste.length);
  }

  suAnSonraki() {
    const liste = this.suAnOkunanListesi();
    this.suAnOkunanIndex.set((this.suAnOkunanIndex() + 1) % liste.length);
  }

  okumayuzdesi = computed(() => {
    const kitap = this.suAnOkunan();
    if (!kitap || !kitap.sayfaSayisi || !kitap.mevcutSayfa) return 0;
    return Math.min(Math.round((kitap.mevcutSayfa / kitap.sayfaSayisi) * 100), 100);
  });

  onerilenKitaplar = computed(() => {
    const metin = this.aramaMetni().toLowerCase().trim();
    if (!metin) return [];
    return this.booksService.kitaplar().filter(k =>
      k.ad.toLowerCase().includes(metin) || k.yazar.toLowerCase().includes(metin)
    );
  });
  sayfaliKitaplar = computed(() => {
  const tumKitaplar = this.tumKitaplar();
  const baslangic = (this.mevcutSayfa() - 1) * this.sayfaBasinaKitap();
  return tumKitaplar.slice(baslangic, baslangic + this.sayfaBasinaKitap());
});

toplamSayfa = computed(() => {
  return Math.max(1, Math.ceil(this.tumKitaplar().length / this.sayfaBasinaKitap()));
});
sayfaListesi = computed(() => {
  const toplam = this.toplamSayfa();
  const mevcut = this.mevcutSayfa();
  const sayfalar: (number | string)[] = [];

  if (toplam <= 7) {
    return Array.from({ length: toplam }, (_, i) => i + 1);
  }

  sayfalar.push(1);
  if (mevcut > 3) sayfalar.push('...');
  for (let i = Math.max(2, mevcut - 1); i <= Math.min(toplam - 1, mevcut + 1); i++) {
    sayfalar.push(i);
  }
  if (mevcut < toplam - 2) sayfalar.push('...');
  sayfalar.push(toplam);

  return sayfalar;
});
sayfaDegistir(sayfa: number) {
  if (sayfa < 1 || sayfa > this.toplamSayfa()) return;
  this.mevcutSayfa.set(sayfa);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

sayfaBasinaKitapDegistir(sayi: number) {
  this.sayfaBasinaKitap.set(sayi);
  this.mevcutSayfa.set(1);
}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.aktifDurumFiltresi.set(params['durum'] ?? '');
    });
  }

  aramaGuncelle(metin: string) {
    this.aramaMetni.set(metin);
    this.oneriGoster.set(true);
  }

  kitapSec(kitap: Book) {
    this.aramaMetni.set(kitap.ad);
    this.oneriGoster.set(false);
  }

  onBlur() { setTimeout(() => this.oneriGoster.set(false), 150); }

  filtreleriTemizle() {
    this.secilenTur.set('');
    this.secilenEtiket.set('');
    this.secilenYazar.set('');
    this.minPuan.set(0);
    this.tarihFiltresi.set('tumu');
    this.sayfaFiltresi.set('tumu');
  }

  birakma(event: CdkDragDrop<Book[]>) {
    if (event.previousContainer === event.container) return;
    const kitap = { ...event.previousContainer.data[event.previousIndex] };
    kitap.durum = event.container.id as OkumaDurumu;

    if (kitap.durum === 'okundu' && kitap.sayfaSayisi) {
      kitap.mevcutSayfa = kitap.sayfaSayisi;
    }

    this.booksService.kitapGuncelle(kitap.id, kitap);
  }

  sayfaGuncelle(id: number, sayfa: number) {
    const kitap = this.booksService.kitapGetir(id);
    if (!kitap) return;

    const eskiSayfa = kitap.mevcutSayfa ?? 0;
    const fark = +sayfa - eskiSayfa;
    if (fark !== 0) {
      this.booksService.okumaGecmisiKaydet(fark);
      this.bugunOkunan.set(this.booksService.bugunOkunanSayfa());
      this.streak.set(this.booksService.streakHesapla());
    }

    const guncelKitap = { ...kitap, mevcutSayfa: +sayfa };

    if (kitap.sayfaSayisi && +sayfa >= kitap.sayfaSayisi) {
      guncelKitap.durum = 'okundu';
      guncelKitap.mevcutSayfa = kitap.sayfaSayisi;
      this.booksService.kitapGuncelle(id, guncelKitap);
      this.degerlendirmeKitabi.set(guncelKitap);
    } else {
      this.booksService.kitapGuncelle(id, guncelKitap);
    }
  }

  hedefKaydet() {
    const yeniHedef = { yil: new Date().getFullYear(), hedef: this.yeniHedef() };
    this.booksService.hedefKaydet(yeniHedef);
    this.hedef.set(yeniHedef);
    this.hedefDuzenle.set(false);
  }

  hedefYuzde(): number {
    return Math.min(Math.round((this.tumOkundu() / this.hedef().hedef) * 100), 100);
  }

  jsonAktar() { this.booksService.jsonAktar(); }

  jsonIcerAktar(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.booksService.jsonIcerAktar(input.files[0]).then(() => {
      alert('Kitaplar başarıyla içe aktarıldı!');
    }).catch(() => {
      alert('Geçersiz dosya!');
    });
  }

  yildizlar(puan: number) { return Array(puan).fill(0); }

  kartIlerlemeYuzdesi(kitap: Book): number {
    if (!kitap.sayfaSayisi || !kitap.mevcutSayfa) return 0;
    return Math.min(Math.round((kitap.mevcutSayfa / kitap.sayfaSayisi) * 100), 100);
  }

  kitapSil(id: number, ad: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { baslik: 'Kitabı Sil', mesaj: `"${ad}" adlı kitabı silmek istediğinizden emin misiniz?` }
    });
    dialogRef.afterClosed().subscribe(sonuc => {
      if (sonuc) this.booksService.kitapSil(id);
    });
  }

  detayAc(kitap: Book) {
    this.dialog.open(BookDetailComponent, { data: kitap, width: '480px' });
  }
}