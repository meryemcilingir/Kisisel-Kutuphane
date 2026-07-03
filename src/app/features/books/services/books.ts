import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../../../core/services/storage';
import { Book, OkumaDurumu, OkumaHedefi } from '../../../core/models/book.model';

const STORAGE_KEY = 'kutuphane_kitaplar';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private storageService = new StorageService();

  private _kitaplar = signal<Book[]>(
    this.storageService.get<Book[]>(STORAGE_KEY) ?? []
  );

  readonly kitaplar = this._kitaplar.asReadonly();

  private aramaMetni = signal('');
  private secilenDurum = signal<OkumaDurumu | 'tumu'>('tumu');
  private secilenTur = signal('');
  private siralamaAlani = signal<'eklenmeTarihi' | 'puan'>('eklenmeTarihi');

  readonly filtrelenmisKitaplar = computed(() => {
    let liste = this._kitaplar();

    const arama = this.aramaMetni().toLowerCase();
    if (arama) {
      liste = liste.filter(k =>
        k.ad.toLowerCase().includes(arama) ||
        k.yazar.toLowerCase().includes(arama)
      );
    }

    const durum = this.secilenDurum();
    if (durum !== 'tumu') {
      liste = liste.filter(k => k.durum === durum);
    }

    const tur = this.secilenTur();
    if (tur) {
      liste = liste.filter(k => k.tur === tur);
    }

    const siralama = this.siralamaAlani();
    liste = [...liste].sort((a, b) => {
      if (siralama === 'puan') return (b.puan ?? 0) - (a.puan ?? 0);
      return new Date(b.eklenmeTarihi).getTime() - new Date(a.eklenmeTarihi).getTime();
    });

    return liste;
  });

  setArama(metin: string) { this.aramaMetni.set(metin); }
  setDurum(durum: OkumaDurumu | 'tumu') { this.secilenDurum.set(durum); }
  setTur(tur: string) { this.secilenTur.set(tur); }
  setSiralama(alan: 'eklenmeTarihi' | 'puan') { this.siralamaAlani.set(alan); }

  kitapEkle(kitap: Omit<Book, 'id' | 'eklenmeTarihi'>): void {
    const yeniKitap: Book = {
      ...kitap,
      id: Date.now(),
      eklenmeTarihi: new Date().toISOString()
    };
    this.kaydet([...this._kitaplar(), yeniKitap]);
  }

  kitapGuncelle(id: number, kitap: Omit<Book, 'id' | 'eklenmeTarihi'>): void {
    const guncellenmis = this._kitaplar().map(k =>
      k.id === id ? { ...k, ...kitap } : k
    );
    this.kaydet(guncellenmis);
  }

  kitapSil(id: number): void {
    this.kaydet(this._kitaplar().filter(k => k.id !== id));
  }

  kitapGetir(id: number): Book | undefined {
    return this._kitaplar().find(k => k.id === id);
  }

  private kaydet(kitaplar: Book[]): void {
    this._kitaplar.set(kitaplar);
    this.storageService.set(STORAGE_KEY, kitaplar);
  }
  // Okuma Hedefi
private readonly HEDEF_KEY = 'kutuphane_hedef';

hedefGetir(): OkumaHedefi {
  return this.storageService.get<OkumaHedefi>(this.HEDEF_KEY) ?? 
    { yil: new Date().getFullYear(), hedef: 12 };
}

hedefKaydet(hedef: OkumaHedefi): void {
  this.storageService.set(this.HEDEF_KEY, hedef);
}

// JSON Aktar
jsonAktar(): void {
  const veri = JSON.stringify(this._kitaplar(), null, 2);
  const blob = new Blob([veri], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kutuphane-yedek-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

jsonIcerAktar(dosya: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const kitaplar = JSON.parse(e.target?.result as string) as Book[];
        this.kaydet(kitaplar);
        resolve();
      } catch {
        reject('Geçersiz JSON dosyası');
      }
    };
    reader.readAsText(dosya);
  });
}
private readonly OKUMA_GECMISI_KEY = 'kutuphane_okuma_gecmisi';

okumaGecmisiKaydet(sayfaSayisi: number): void {
  const gecmis = this.storageService.get<Record<string, number>>(this.OKUMA_GECMISI_KEY) ?? {};
  const bugun = new Date().toISOString().split('T')[0];
  gecmis[bugun] = (gecmis[bugun] ?? 0) + sayfaSayisi;
  this.storageService.set(this.OKUMA_GECMISI_KEY, gecmis);
}

okumaGecmisiGetir(): Record<string, number> {
  return this.storageService.get<Record<string, number>>(this.OKUMA_GECMISI_KEY) ?? {};
}

bugunOkunanSayfa(): number {
  const gecmis = this.okumaGecmisiGetir();
  const bugun = new Date().toISOString().split('T')[0];
  return gecmis[bugun] ?? 0;
}

streakHesapla(): number {
  const gecmis = this.okumaGecmisiGetir();
  let streak = 0;
  const tarih = new Date();

  while (true) {
    const gunStr = tarih.toISOString().split('T')[0];
    if (gecmis[gunStr] && gecmis[gunStr] > 0) {
      streak++;
      tarih.setDate(tarih.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
}