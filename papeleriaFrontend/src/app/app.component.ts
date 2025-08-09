import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms'; 
import { CartService } from './services/cart.service';
import { InactivityService } from './services/inactivity.service';
import { InactivityTimerComponent } from './components/inactivity-timer/inactivity-timer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InactivityTimerComponent],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false; 
  title = 'papeleria-frontend';
  categorias: any[] = [];
  opiniones: any[] = [];
  cartItemCount: number = 0;

  nuevaOpinion: any = {  
    userName: '',
    Calificacion: '',
    text: '',
    UsuarioId: '',
    ProductoId: ''
  };

  constructor(
    private apiService: ApiService, 
    private cartService: CartService, 
    private router: Router,
    private inactivityService: InactivityService
  ) {}

  ngOnInit(): void { 
    this.checkAuthentication();
    this.setupAuthListener();
    this.setupRouteListener();
    this.setupInactivityListener();
    this.fetchOpiniones();
    this.apiService.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorías recibidas:', JSON.stringify(data));
        this.categorias = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error obteniendo categorías:', error);
      }
    });

    this.cartService.currentCart.subscribe((cart: { quantity: number }[]) => {
      this.cartItemCount = cart.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
    });
  }

  checkAuthentication(): void {
    if (typeof window !== 'undefined') {
      this.isAuthenticated = !!localStorage.getItem('token');
    }
  }

  setupAuthListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'token') {
          this.checkAuthentication();
        }
      });

      window.addEventListener('auth:login', () => {
        this.checkAuthentication();
      });

      window.addEventListener('auth:logout', () => {
        this.checkAuthentication();
      });
    }
  }

  setupRouteListener(): void {
    this.router.events.subscribe(() => {
      this.checkAuthentication();
    });
  }

  setupInactivityListener(): void {
    // Iniciar monitoreo de inactividad cuando el usuario esté autenticado
    if (this.isAuthenticated) {
      this.inactivityService.startMonitoring();
    }

    // Escuchar cambios en autenticación para iniciar/detener monitoreo
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:login', () => {
        this.inactivityService.startMonitoring();
      });

      window.addEventListener('auth:logout', () => {
        this.inactivityService.stopMonitoring();
      });
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      this.isAuthenticated = false;
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    this.inactivityService.stopMonitoring();
    this.cartService.clearCart();
    this.router.navigate(['/auth']);
  }

  submitOpinion(): void {  
    const opinionData = {
      UsuarioId: this.nuevaOpinion.UsuarioId || '',
      Nombre: this.nuevaOpinion.userName || '',
      Calificacion: Number(this.nuevaOpinion.Calificacion) || 0,
      Comentario: this.nuevaOpinion.text || '',
      Fecha: new Date()
    };

    this.apiService.registrarOpinion(opinionData).subscribe({
      next: () => {
        console.log('Opinión enviada correctamente.');
        this.nuevaOpinion = { userName: '', Calificacion: '', text: '', UsuarioId: '', ProductoId: '' };
        this.fetchOpiniones();
      },
      error: (error) => {
        console.error('Error al enviar la opinión:', error);
      }
    });
  }

  fetchOpiniones(): void {
    this.apiService.getOpiniones().subscribe({
      next: (data) => {
        this.opiniones = Array.isArray(data) ? data.map(opinion => ({
          ...opinion,
          Nombre: opinion.nombre 
        })) : [];
      },
      error: (error) => {
        console.error('Error obteniendo opiniones:', error);
      }
    });
  }
}
