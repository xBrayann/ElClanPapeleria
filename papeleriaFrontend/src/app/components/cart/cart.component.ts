import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PaypalService } from '../../services/paypal.service';

declare var paypal: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  metodosPago: any[] = [];
  metodoSeleccionado: string = '';
  payPalLoaded: boolean = false;

  constructor(private cartService: CartService, private apiService: ApiService, private paypalService: PaypalService) {}

  ngOnInit(): void {
    this.cartService.currentCart.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
    this.loadMetodosPago();
    this.loadPayPalSDK();
  }

  getItemsForPago(): {title: string, quantity: number, unit_price: number}[] {
    return this.cartItems.map(item => ({
      title: item.nombre,
      quantity: item.quantity,
      unit_price: item.precio
    }));
  }

  loadPayPalSDK(): void {
    if (this.payPalLoaded) return;
    this.paypalService.loadPayPalSDK('AVE0giYmJo-gLAMyJcQ4T7ORNuuLJErsMKoRuU8XvarGA3Xk-v49aBqJomZmJqyGW2H-dI3J5Vm5VME7', 'USD')
      .then(() => {
        this.payPalLoaded = true;
      })
      .catch((err) => {
        alert('Error cargando el SDK de PayPal: ' + err.message);
      });
  }

  loadMetodosPago(): void {
    this.apiService.getMetodosPago().subscribe({
      next: (data) => this.metodosPago = data,
      error: () => this.metodosPago = []
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  }

  updateQuantity(item: any, quantity: number): void {
    item.quantity = quantity;
    this.calculateTotal();
    this.saveCart();
  }

  removeItem(item: any): void {
    this.cartService.removeFromCart(item.id);
    this.calculateTotal();
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  iniciarPago(orderData: {items: {title: string, quantity: number, unit_price: number}[]}): void {
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
  {
    amount: {
      currency_code: 'USD',
      value: orderData.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2)
    },
    description: 'Compra en Papelería'
  }
]

    };

    console.log('Order Request:', orderRequest);

    this.apiService.createOrder(orderRequest).subscribe({
      next: (order) => {
        if (!this.payPalLoaded) {
          alert('El SDK de PayPal no está cargado aún.');
          return;
        }
        const container = document.getElementById('paypal-button-container-cart');

        if (container) {
          container.innerHTML = '';
          // @ts-ignore
          paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return order.id;
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                alert('Pago completado por ' + details.payer.name.given_name);
              });
            },
            onError: (err: any) => {
              alert('Error en el pago: ' + err);
            }
          }).render(container);
        }
      },
      error: (err) => {
        alert('Error al crear la orden de pago: ' + err.message);
      }
    });
  }
}
