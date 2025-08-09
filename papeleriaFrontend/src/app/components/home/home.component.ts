import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service'; // Importar CartService
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router, private cartService: CartService) {} // Inyectar CartService

  navigateToProducts(): void { // Método para navegar a productos
    this.router.navigate(['/productos']); // Redirigir a la página de productos
  }

  addProductToCart(product: any): void { // Método para agregar producto al carrito
    console.log('Producto a agregar:', product); // Verificar el producto que se está agregando
    this.cartService.addToCart(product); // Llamar al método addToCart del servicio

    this.router.navigate(['/cart']); // Redirigir a la página del carrito
  }
}
