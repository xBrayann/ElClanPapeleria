import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  currentCart = this.cartItems.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadCart();
    }

  }

  addToCart(product: any) {
    let currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      product.quantity = 1;
      currentItems = [...currentItems, product];
    }
    
    this.cartItems.next(currentItems);
    this.saveCart();
  }

  removeFromCart(productId: string) {
    const updatedItems = this.cartItems.value.filter(item => item.id !== productId);
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  updateCart(items: any[]) {
    this.cartItems.next(items);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  loadCart(): void { // Asegúrate de que sea público
    const storedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;

    this.cartItems.next(storedCart ? JSON.parse(storedCart) : []);

  }
}
