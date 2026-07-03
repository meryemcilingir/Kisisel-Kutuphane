export type OkumaDurumu = 'okunacak' | 'okunuyor' | 'okundu';
export type Etiket = 'klasik' | 'favori' | 'tekrar-oku' | 'hediye' | 'okuma-listesi';

export interface Book {
  id: number;
  ad: string;
  yazar: string;
  tur?: string;
  durum: OkumaDurumu;
  sayfaSayisi?: number;
  puan?: number;
  not?: string;
  eklenmeTarihi: string;
  baslamaTarihi?: string;
  bitisTarihi?: string;
  etiketler?: Etiket[];
   kapak?: string;
   mevcutSayfa?: number;
  gunlukHedef?: number;
  aciklama?: string;
}

export interface OkumaHedefi {
  yil: number;
  hedef: number;
}