import { AbstractControl, ValidationErrors } from '@angular/forms';

export function puanValidator(control: AbstractControl): ValidationErrors | null {
  const deger = control.value;
  if (deger === null || deger === undefined || deger === '') return null;
  if (deger < 1 || deger > 5) {
    return { gecersizPuan: 'Puan 1 ile 5 arasında olmalıdır.' };
  }
  return null;
}

export function sayfaSayisiValidator(control: AbstractControl): ValidationErrors | null {
  const deger = control.value;
  if (deger === null || deger === undefined || deger === '') return null;
  if (deger < 1) {
    return { gecersizSayfa: 'Sayfa sayısı 0\'dan büyük olmalıdır.' };
  }
  return null;
}
export function metinUzunlukValidator(maxUzunluk: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const deger = control.value;
    if (!deger) return null;
    if (deger.length > maxUzunluk) {
      return { metinCokUzun: `En fazla ${maxUzunluk} karakter olabilir.` };
    }
    return null;
  };
}