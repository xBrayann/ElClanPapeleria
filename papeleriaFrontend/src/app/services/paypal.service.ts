import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private payPalLoaded = false;
  private loadPromise: Promise<void> | null = null;

  loadPayPalSDK(clientId: string, currency: string = 'USD'): Promise<void> {
    if (this.payPalLoaded) {
      return Promise.resolve();
    }
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
      script.onload = () => {
        this.payPalLoaded = true;
        resolve();
      };
      script.onerror = (err) => {
        reject(new Error('Failed to load PayPal SDK script'));
      };
      document.body.appendChild(script);
    });

    return this.loadPromise;
  }
}
