import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PaypalService } from '../../services/paypal.service';

@Component({
  selector: 'app-metodo-pago-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metodo-pago-list.component.html',
  styleUrls: ['./metodo-pago-list.component.css']
})
export class MetodoPagoListComponent implements OnInit {
  metodosPago: any[] = [];
  errorMessage: string = '';
  nuevoMetodo: any = {
    nombre: '',
    descripcion: '',
    activo: true
  };
  successMessage: string = '';
  payPalLoaded: boolean = false;

  constructor(private apiService: ApiService, private paypalService: PaypalService) { }

  ngOnInit(): void {
    this.loadMetodosPago();
    this.loadPayPalSDK();
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
      error: (err) => this.errorMessage = 'Error cargando métodos de pago'
    });
  }

  addMetodoPago(): void {
    this.apiService.addMetodoPago(this.nuevoMetodo).subscribe({
      next: () => {
        this.successMessage = 'Método de pago agregado exitosamente';
        this.errorMessage = '';
        this.nuevoMetodo = { nombre: '', descripcion: '', activo: true };
        this.loadMetodosPago();
      },
      error: () => {
        this.errorMessage = 'Error agregando método de pago';
        this.successMessage = '';
      }
    });
  }

  deleteMetodoPago(id: string): void {
    if (confirm('¿Estás seguro de eliminar este método de pago?')) {
      this.apiService.deleteMetodoPago(id).subscribe({
        next: () => this.loadMetodosPago(),
        error: () => this.errorMessage = 'Error eliminando método de pago'
      });
    }
  }

  iniciarPago(orderData: any): void {
  
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: orderData.items.map((item: any) => ({
        amount: {
          currency_code: 'USD',
          value: (item.unit_price * item.quantity / 100).toFixed(2)
        },
        description: item.title
      }))
    };

    this.apiService.createOrder(orderRequest).subscribe({
      next: (order) => {
        if (!this.payPalLoaded) {
          alert('El SDK de PayPal no está cargado aún.');
          return;
        }
        const container = document.getElementById('paypal-button-container');
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
