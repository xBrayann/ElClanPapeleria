import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service'; // Importar CartService
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router
import { RouterModule } from '@angular/router';
import { PromotionsCarouselComponent } from '../promotions-carousel/promotions-carousel.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PromotionsCarouselComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading = true;

  constructor(private apiService: ApiService, private cartService: CartService, private router: Router) {} // Inyectar Router


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.products = data; 
        console.log('Productos cargados:', this.products); 
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
    
    if (this.products.length === 0) { 
        console.warn('No se encontraron productos.');
    }

    console.log('Estado de loading:', this.loading);
    console.log('Productos actuales:', this.products);
  }

}
