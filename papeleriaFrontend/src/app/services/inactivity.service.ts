import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, timer, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private inactivityTimer$ = new BehaviorSubject<number>(0);
  private destroy$ = new Subject<void>();
  private activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
  private timeoutDuration = 2 * 60 * 1000; // 2 minutos en milisegundos
  private timer: any;

  constructor(private router: Router) {}

  startMonitoring(): void {
    this.resetTimer();
    this.setupActivityListeners();
  }

  stopMonitoring(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearTimer();
    this.removeActivityListeners();
  }

  private setupActivityListeners(): void {
    if (typeof window !== 'undefined') {
      this.activityEvents.forEach(event => {
        window.addEventListener(event, () => this.resetTimer(), true);
      });
    }
  }

  private removeActivityListeners(): void {
    if (typeof window !== 'undefined') {
      this.activityEvents.forEach(event => {
        window.removeEventListener(event, () => this.resetTimer(), true);
      });
    }
  }

  private resetTimer(): void {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.handleInactivity();
    }, this.timeoutDuration);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private handleInactivity(): void {
    if (typeof window !== 'undefined') {
      // Limpiar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      // Mostrar alerta al usuario
      alert('Tu sesión ha sido cerrada por inactividad. Por favor, inicia sesión nuevamente.');
      
      // Redirigir al login
      this.router.navigate(['/auth']);
    }
  }

  getRemainingTime(): Observable<number> {
    return this.inactivityTimer$.asObservable();
  }

  // Método para cambiar la duración del timeout (en minutos)
  setTimeoutDuration(minutes: number): void {
    this.timeoutDuration = minutes * 60 * 1000;
    this.resetTimer();
  }
}
