import { Pipe, PipeTransform } from '@angular/core';
import { OkumaDurumu } from '../../core/models/book.model';

@Pipe({
  name: 'durumEtiket',
  standalone: true
})
export class DurumEtiketPipe implements PipeTransform {
  transform(durum: OkumaDurumu): string {
    const etiketler: Record<OkumaDurumu, string> = {
      okunacak: 'Okunacak',
      okunuyor: 'Okunuyor',
      okundu: 'Okundu'
    };
    return etiketler[durum] ?? durum;
  }
}