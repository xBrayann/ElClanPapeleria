import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promotions-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './promotions-carousel.component.html',
  styleUrls: ['./promotions-carousel.component.css']
})
export class PromotionsCarouselComponent implements OnInit, OnDestroy {
  promotions = [
    {
      id: 1,
      title: 'Descuento en Papelería',
      description: 'Aprovecha un 20% de descuento en todos los productos de papelería.',
      image: 'https://imgs.search.brave.com/2EOYoMxbQlCm9Wkb0oRf4-s_lCMj_ejH_Ib3mGtrxoQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS8yMC1jaWVudG8t/ZGVzY3VlbnRvLXBy/b21vY2lvbl8yMjI3/LTE0NC5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQw',
      link: '/productos?promo=papeleria'
    },
    {
      id: 2,
      title: 'Oferta en Cuadernos',
      description: 'Compra 2 cuadernos y llévate el 3ro gratis.',
      image: 'https://imgs.search.brave.com/L5wVR02lcmSeUfSeZ8A-Xu9yQlXs-YyacfGtaL0g23o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHNkLWdyYXRpcy9z/dXBlci1vZmVydGEt/YmFubmVyLTNkLXRl/eHRvLWVkaXRhYmxl/LXByb21vY2lvbl80/Nzk4Ny0xMjcxNS5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw',
      link: '/productos?promo=cuadernos'
    },
    {
      id: 3,
      title: 'Promoción de Regreso a Clases',
      description: 'Descuentos especiales en útiles escolares para el regreso a clases.',
      image: 'https://imgs.search.brave.com/L0rrxoUGXF_pdekS25dpcfPyujkGeBP6ftAlYyi62_g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vRUFGcjJC/Ul91TDgvMi8wLzE2/MDB3L2NhbnZhLXBv/c3QtZGUtZmFjZWJv/b2stcmVncmVzby1h/LWNsYXNlcy1wcm9t/b2NpJUMzJUIzbi1j/b2xsYWdlLWJsYW5j/by1YNjhvdjBsdnpH/VS5qcGc',
      link: '/productos?promo=regreso-a-clases'
    }
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000); 
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.promotions.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.promotions.length) % this.promotions.length;
  }

  onManualChange() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
