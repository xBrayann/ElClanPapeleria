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
  timeRemaining: number = 120; // 2 minutes in seconds
  isWarningVisible: boolean = false;
  private warningThreshold: number = 30; // Show warning when 30 seconds left

  constructor(private inactivityService: InactivityService) {}

  ngOnInit(): void {
    // Since the service doesn't provide remaining time, we'll simulate
    // the warning based on a simple timer approach
    this.isWarningVisible = false;
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Method to show warning (called by parent component or service)
  showWarning(): void {
    this.isWarningVisible = true;
    this.timeRemaining = 120; // Reset to 2 minutes
  }

  // Method to hide warning
  hideWarning(): void {
    this.isWarningVisible = false;
  }

  extendSession(): void {
    // Reset the inactivity timer
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
