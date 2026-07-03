import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../services/books';
import { GoogleBooksService, GoogleKitap } from '../../services/google-books';
import { puanValidator, sayfaSayisiValidator } from '../../../../shared/validators/kitap-validator';
import { Etiket } from '../../../../core/models/book.model';

@Component({
  selector: 'app-books-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule,
    MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './books-form.html',
  styleUrl: './books-form.scss'
})
export class BooksFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private googleBooks = inject(GoogleBooksService);
  private snackBar = inject(MatSnackBar);

  duzenlemeModu = false;
  kitapId: number | null = null;
  formDegisti = false;
  googleArama = '';
  googleSonuclar = signal<GoogleKitap[]>([]);
  aramaYukleniyor = signal(false);
  secilenKapak = signal('');
  secilenAciklama = signal('');
  private aramaTimeout: any;

  etiketSecenekleri: Etiket[] = ['klasik', 'favori', 'tekrar-oku', 'hediye', 'okuma-listesi'];

  form = this.fb.group({
  ad: ['', [Validators.required, Validators.maxLength(200)]],
  yazar: ['', [Validators.required, Validators.maxLength(150)]],
  tur: [''],
  durum: ['okunacak', Validators.required],
  sayfaSayisi: [null as number | null, sayfaSayisiValidator],
  puan: [null as number | null, puanValidator],
  not: ['', Validators.maxLength(500)],
baslamaTarihi: [null as number | null],
bitisTarihi: [null as number | null],
  etiketler: [[] as Etiket[]]
});

  ngOnInit() {
    this.form.valueChanges.subscribe(() => this.formDegisti = true);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.duzenlemeModu = true;
      this.kitapId = +id;
      const kitap = this.booksService.kitapGetir(this.kitapId);
      if (kitap) {
        this.form.patchValue(kitap as any);
        this.formDegisti = false;
      }
    }
  }

  googleAramaYap(event: Event) {
    const metin = (event.target as HTMLInputElement).value;
    clearTimeout(this.aramaTimeout);
    if (!metin.trim()) { this.googleSonuclar.set([]); return; }
    this.aramaYukleniyor.set(true);
    this.aramaTimeout = setTimeout(async () => {
      const sonuclar = await this.googleBooks.kitapAra(metin);
      this.googleSonuclar.set(sonuclar);
      this.aramaYukleniyor.set(false);
    }, 500);
  }

  async googleKitapSec(kitap: GoogleKitap) {
    this.form.patchValue({
      ad: kitap.ad,
      yazar: kitap.yazar,
      sayfaSayisi: kitap.sayfaSayisi ?? null,
    });
    if (kitap.kapak) this.secilenKapak.set(kitap.kapak);
    this.googleSonuclar.set([]);
    this.googleArama = '';
    this.formDegisti = true;

    if (kitap.id?.startsWith('/works/')) {
      const detay = await this.googleBooks.detayGetir(kitap.id);
      if (detay.aciklama) this.secilenAciklama.set(detay.aciklama);
    }
  }

  etiketToggle(etiket: Etiket) {
    const mevcutEtiketler = [...((this.form.get('etiketler')?.value as unknown as Etiket[]) ?? [])];
    const index = mevcutEtiketler.indexOf(etiket);
    if (index > -1) mevcutEtiketler.splice(index, 1);
    else mevcutEtiketler.push(etiket);
    (this.form as any).patchValue({ etiketler: mevcutEtiketler });
  }

  etiketSecildi(etiket: Etiket): boolean {
    return ((this.form.get('etiketler')?.value as unknown as Etiket[]) ?? []).includes(etiket);
  }

  puanSec(puan: number) { this.form.patchValue({ puan }); }
  karakterSinirla(alan: string, limit: number) {
  const kontrol = this.form.get(alan);
  const deger = kontrol?.value as string;
  if (deger && deger.length > limit) {
    kontrol?.setValue(deger.slice(0, limit));
  }
}
tarihSinirla(alan: string) {
  const kontrol = this.form.get(alan);
  const input = document.querySelector(`input[formcontrolname="${alan}"]`) as HTMLInputElement;
  if (!input || !input.value) return;

  const parcalar = input.value.split('-');
  if (parcalar.length !== 3) return;

  let yil = parcalar[0];
  const ay = parcalar[1];
  const gun = parcalar[2];

  if (yil.length > 4) {
    yil = yil.slice(0, 4);
    kontrol?.setValue(`${yil}-${ay}-${gun}`);
    input.value = `${yil}-${ay}-${gun}`;
  }
}

  kaydet() {
    if (this.form.invalid) return;
    const deger = this.form.value as any;
    if (this.secilenKapak()) deger.kapak = this.secilenKapak();
    if (this.secilenAciklama()) deger.aciklama = this.secilenAciklama();
    if (this.duzenlemeModu && this.kitapId) {
      this.booksService.kitapGuncelle(this.kitapId, deger);
      this.snackBar.open('✅ Kitap güncellendi!', 'Kapat', { duration: 3000 });
    } else {
      this.booksService.kitapEkle(deger);
      this.snackBar.open('✅ Kitap eklendi!', 'Kapat', { duration: 3000 });
    }
    this.formDegisti = false;
    this.router.navigate(['/kitaplar']);
  }

  geriDon() { this.router.navigate(['/kitaplar']); }
}
