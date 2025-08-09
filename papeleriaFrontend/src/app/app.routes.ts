import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; 
import { FormsModule } from '@angular/forms'; 

import { ProductListComponent } from './components/product-list/product-list.component';
import { OpinionesComponent } from './components/opiniones/opiniones.component'; 
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthComponent } from './components/auth/auth.component';
import { MetodoPagoListComponent } from './components/metodo-pago/metodo-pago-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }, 


  { path: 'productos', component: ProductListComponent },

  { path: 'productos/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'opiniones', component: OpinionesComponent }, 
  { path: 'metodos-pago', component: MetodoPagoListComponent }, 
  { path: '**', redirectTo: '/home' }



];
