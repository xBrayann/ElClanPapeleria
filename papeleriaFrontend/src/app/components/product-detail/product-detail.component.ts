import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  loading = true;
  error: string | null = null;
  cart: any[] = [];
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private router: Router
  ) {
    this.isAuthenticated = !!localStorage.getItem('token');
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error = 'Producto no encontrado';
      this.loading = false;
    }
  }

  loadProduct(id: string): void {
    console.log('Loading product with ID:', id);
    this.apiService.getProductById(id).subscribe({
      next: (data) => {
        console.log('Product data received:', data);
        if (data) {
          this.product = data;
        } else {
          this.error = 'Producto no encontrado';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Error al cargar el producto';
        this.loading = false;
      }
    });
  }

  addToCart(product: any): void {
    if (!localStorage.getItem('token')) {
      alert('Por favor, inicia sesión para agregar productos al carrito.');
      return;
    }
    this.cartService.addToCart(product);
    this.router.navigate(['/carrito']);
  }
}
