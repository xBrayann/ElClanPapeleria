import { Component, OnInit, OnDestroy } from '@angular/core';
import { InactivityService } from '../../services/inactivity.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inactivity-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inactivity-timer.component.html'
})
export class InactivityTimerComponent implements OnInit, OnDestroy {
  timeRemaining: number = 60; //  seconds
  isWarningVisible: boolean = false;
  private warningThreshold: number = 30;

  constructor(private inactivityService: InactivityService) {}

  ngOnInit(): void {
    
    this.isWarningVisible = false;
  }

  ngOnDestroy(): void {
  }


  showWarning(): void {
    this.isWarningVisible = true;
    this.timeRemaining = 60; // Reset minutes
  }

  hideWarning(): void {
    this.isWarningVisible = false;
  }

  extendSession(): void {
    this.inactivityService.stopMonitoring();
    this.inactivityService.startMonitoring();
    this.isWarningVisible = false;
  }

  logout(): void {
    this.inactivityService.stopMonitoring();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/auth';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
