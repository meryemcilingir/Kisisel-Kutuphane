import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { BooksService } from './features/books/services/books';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  private booksService = inject(BooksService);

  darkMode = signal(false);
  sidebarAcik = signal(false);
  ekranGenisligi = signal(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.ekranGenisligi.set(window.innerWidth);
  }

  isMobile(): boolean {
    return this.ekranGenisligi() <= 900;
  }

  sidebarToggle() {
    this.sidebarAcik.set(!this.sidebarAcik());
  }

  sidebarKapat() {
    this.sidebarAcik.set(false);
  }

  toplamKitap = computed(() => this.booksService.kitaplar().length);
  okunacakSayi = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okunacak').length);
  okunuyorSayi = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okunuyor').length);
  okuduSayi = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okundu').length);

  toggleDark() {
    this.darkMode.set(!this.darkMode());
    document.body.classList.toggle('dark-mode', this.darkMode());
  }
}