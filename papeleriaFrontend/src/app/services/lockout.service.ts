import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, combineLatest } from 'rxjs';
import { map, take, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LockoutService {
  private lockoutEndTimeSubject = new BehaviorSubject<number>(0);
  private failedAttemptsSubject = new BehaviorSubject<number>(0);
  
  lockoutEndTime$ = this.lockoutEndTimeSubject.asObservable();
  failedAttempts$ = this.failedAttemptsSubject.asObservable();
  
  private readonly LOCKOUT_DURATION = 30; 
  private readonly MAX_ATTEMPTS = 3;

  constructor() {
    this.loadFromStorage();
    this.setupTimer();
  }

  private setupTimer(): void {
    // Timer que se activa cuando hay un bloqueo activo
    combineLatest([this.lockoutEndTime$, timer(0, 1000)]).pipe(
      map(([endTime, _]) => {
        const now = Date.now();
        return endTime > now ? Math.floor((endTime - now) / 1000) : 0;
      }),
      distinctUntilChanged()
    ).subscribe(seconds => {
      // Si el tiempo llega a 0, limpiar el bloqueo
      if (seconds === 0 && this.lockoutEndTimeSubject.value > 0) {
        this.clearLockout();
      }
    });
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const endTime = parseInt(localStorage.getItem('lockoutEndTime') || '0', 10);
      const attempts = parseInt(localStorage.getItem('failedAttempts') || '0', 10);
      
      if (endTime > Date.now()) {
        this.lockoutEndTimeSubject.next(endTime);
      } else {
        // Si el tiempo expiró, limpiar
        this.clearLockout();
      }
      this.failedAttemptsSubject.next(attempts);
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lockoutEndTime', this.lockoutEndTimeSubject.value.toString());
      localStorage.setItem('failedAttempts', this.failedAttemptsSubject.value.toString());
    }
  }

  recordFailedAttempt(): void {
    const currentAttempts = this.failedAttemptsSubject.value + 1;
    this.failedAttemptsSubject.next(currentAttempts);
    
    if (currentAttempts >= this.MAX_ATTEMPTS) {
      this.startLockout();
    }
    
    this.saveToStorage();
  }

  private startLockout(): void {
    const endTime = Date.now() + (this.LOCKOUT_DURATION * 1000);
    this.lockoutEndTimeSubject.next(endTime);
    this.saveToStorage();
  }

  clearLockout(): void {
    this.lockoutEndTimeSubject.next(0);
    this.failedAttemptsSubject.next(0);
    this.saveToStorage();
  }

  getTimeRemaining(): Observable<number> {
    return combineLatest([this.lockoutEndTime$, timer(0, 1000)]).pipe(
      map(([endTime, _]) => {
        const now = Date.now();
        return endTime > now ? Math.floor((endTime - now) / 1000) : 0;
      }),
      distinctUntilChanged()
    );
  }

  isLockedOut(): Observable<boolean> {
    return combineLatest([this.lockoutEndTime$, timer(0, 1000)]).pipe(
      map(([endTime, _]) => endTime > Date.now()),
      distinctUntilChanged()
    );
  }

  getRemainingTimeFormatted(): Observable<string> {
    return this.getTimeRemaining().pipe(
      map(seconds => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      })
    );
  }
}
