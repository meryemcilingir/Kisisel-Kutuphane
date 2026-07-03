import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DurumRozetDirective } from '../../directives/durum-rozet';
import { DurumEtiketPipe } from '../../pipes/durum-etiket-pipe';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, RouterLink, DatePipe, DurumRozetDirective, DurumEtiketPipe],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss'
})
export class BookDetailComponent {
  constructor(
    private dialogRef: MatDialogRef<BookDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ) {}

  kapat() { this.dialogRef.close(); }
}