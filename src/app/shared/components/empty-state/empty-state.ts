import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss'
})
export class EmptyStateComponent {
  @Input() baslik = 'Henüz kitap yok';
  @Input() mesaj = 'İlk kitabını eklemek için butona tıkla.';
  @Input() butonYazi = 'Kitap Ekle';
  @Input() butonLink = '/kitaplar/ekle';
}