import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { LockoutService } from '../../../services/lockout.service';

@Component({
  selector: 'app-lockout-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLockedOut$ | async" class="lockout-container">
      <div class="lockout-card">
        <div class="lockout-icon">
          <i class="fas fa-lock"></i>
        </div>
        <h3>Cuenta Bloqueada</h3>
        <p class="lockout-message">
          Demasiados intentos fallidos. Por favor espera.
        </p>
        <div class="timer-display">
          <span class="timer-value">{{ timeRemaining$ | async }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progressPercentage"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./lockout-timer.component.css']
})
export class LockoutTimerComponent implements OnInit, OnDestroy {
  isLockedOut$: Observable<boolean>;
  timeRemaining$: Observable<string>;
  progressPercentage = 0;
  
  private subscriptions: Subscription = new Subscription();

  constructor(private lockoutService: LockoutService) {
    this.isLockedOut$ = this.lockoutService.isLockedOut();
    this.timeRemaining$ = this.lockoutService.getRemainingTimeFormatted();
  }

  ngOnInit(): void {
    const timeSub = this.lockoutService.getTimeRemaining().subscribe((seconds: number) => {
      this.progressPercentage = ((60 - seconds) / 60) * 100;
    });
    this.subscriptions.add(timeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
