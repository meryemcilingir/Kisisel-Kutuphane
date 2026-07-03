import { Injectable } from '@angular/core';

export interface GoogleKitap {
  id: string;
  ad: string;
  yazar: string;
  tur?: string;
  sayfaSayisi?: number;
  aciklama?: string;
  kapak?: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleBooksService {

  async kitapAra(sorgu: string): Promise<GoogleKitap[]> {
    if (!sorgu.trim()) return [];
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(sorgu)}&fields=key,title,author_name,number_of_pages_median,cover_i,first_publish_year&limit=6`;

    try {
      const res = await fetch(url);
      const veri = await res.json();
      if (!veri.docs) return [];

      return veri.docs.map((item: any) => ({
        id: item.key ?? Math.random().toString(),
        ad: item.title ?? '',
        yazar: item.author_name?.[0] ?? '',
        sayfaSayisi: item.number_of_pages_median,
        kapak: item.cover_i
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
          : undefined
      }));
    } catch {
      return [];
    }
  }

  async detayGetir(workId: string): Promise<{ aciklama?: string; sayfaSayisi?: number }> {
    try {
      const url = `https://openlibrary.org${workId}.json`;
      const res = await fetch(url);
      const veri = await res.json();

      let aciklama: string | undefined;
      if (typeof veri.description === 'string') {
        aciklama = veri.description;
      } else if (veri.description?.value) {
        aciklama = veri.description.value;
      }

      return { aciklama };
    } catch {
      return {};
    }
  }
}