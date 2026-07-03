import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { BooksService } from '../../services/books';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  private booksService = inject(BooksService);

  toplamKitap = computed(() => this.booksService.kitaplar().length);
  toplamOkundu = computed(() => this.booksService.kitaplar().filter(k => k.durum === 'okundu').length);
  toplamSayfa = computed(() => this.booksService.kitaplar().reduce((t, k) => t + (k.sayfaSayisi ?? 0), 0).toLocaleString('tr-TR'));
  toplamYazar = computed(() => new Set(this.booksService.kitaplar().map(k => k.yazar)).size);
  toplamTur = computed(() => new Set(this.booksService.kitaplar().map(k => k.tur).filter(Boolean)).size);
 ortalamaPuan = computed(() => {
  const puanlilar = this.booksService.kitaplar().filter(k => k.puan);
  if (!puanlilar.length) return '—';
  const ort = puanlilar.reduce((t, k) => t + (k.puan ?? 0), 0) / puanlilar.length;
  return ort.toFixed(1);
});

  turDagilimi = computed((): ChartData => {
    const turler: Record<string, number> = {};
    this.booksService.kitaplar().forEach(k => {
      const tur = k.tur || 'Belirtilmemiş';
      turler[tur] = (turler[tur] ?? 0) + 1;
    });
    return {
      labels: Object.keys(turler),
      datasets: [{
        data: Object.values(turler),
        backgroundColor: ['#8b5cf6','#3b82f6','#22c55e','#f59e0b','#ec4899','#06b6d4','#ef4444','#a3e635'],
        borderWidth: 2, borderColor: '#fff'
      }]
    };
  });

  durumDagilimi = computed((): ChartData => {
    const kitaplar = this.booksService.kitaplar();
    return {
      labels: ['Okunacak', 'Okunuyor', 'Okundu'],
      datasets: [{
        data: [
          kitaplar.filter(k => k.durum === 'okunacak').length,
          kitaplar.filter(k => k.durum === 'okunuyor').length,
          kitaplar.filter(k => k.durum === 'okundu').length
        ],
        backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e'],
        borderWidth: 2, borderColor: '#fff'
      }]
    };
  });

  aylikOkuma = computed((): ChartData => {
    const aylar = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
    const sayilar = new Array(12).fill(0);
    const buYil = new Date().getFullYear();
    this.booksService.kitaplar()
      .filter(k => k.durum === 'okundu' && new Date(k.eklenmeTarihi).getFullYear() === buYil)
      .forEach(k => { sayilar[new Date(k.eklenmeTarihi).getMonth()]++; });
    return {
      labels: aylar,
      datasets: [{
        label: 'Okunan Kitap',
        data: sayilar,
        backgroundColor: 'rgba(118, 75, 162, 0.7)',
        borderColor: '#764ba2',
        borderWidth: 2,
        borderRadius: 8
      }]
    };
  });

  enCokOkunanYazarlar = computed(() => {
    const yazarlar: Record<string, number> = {};
    this.booksService.kitaplar().forEach(k => {
      yazarlar[k.yazar] = (yazarlar[k.yazar] ?? 0) + 1;
    });
    const sirali = Object.entries(yazarlar).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const max = sirali[0]?.[1] ?? 1;
    return sirali.map(([ad, sayi]) => ({ ad, sayi, yuzde: (sayi / max) * 100 }));
  });

  pieOptions: ChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

 barOptions: ChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } },
    x: { ticks: { maxRotation: 45, minRotation: 45 } }
  }
};
}