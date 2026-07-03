import { Directive, Input, OnChanges, ElementRef, Renderer2 } from '@angular/core';
import { OkumaDurumu } from '../../core/models/book.model';

@Directive({
  selector: '[durumRozet]',
  standalone: true
})
export class DurumRozetDirective implements OnChanges {
  @Input() durumRozet: OkumaDurumu = 'okunacak';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    const renkler: Record<OkumaDurumu, string> = {
      okunacak: '#f59e0b',
      okunuyor: '#3b82f6',
      okundu: '#22c55e'
    };
    this.renderer.setStyle(this.el.nativeElement, 'background-color', renkler[this.durumRozet]);
    this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '2px 10px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '12px');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '12px');
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', '600');
  }
}