import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LockoutService } from '../../services/lockout.service';
import { LockoutTimerComponent } from './lockout-timer/lockout-timer.component';

import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { ValidationPatterns } from '../../utils/validation-patterns';
import { SmartValidator } from '../../utils/smart-validator';

interface LoginData {
  email: string;
  contrasena: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LockoutTimerComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  auth: Auth;

  isLoginMode = true;
  isLoggedIn = false;
  isEmailSent = false;
  pendingUserData: any = null;
  verificationCode = '';
  isVerificationSent = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cartService: CartService,
    private lockoutService: LockoutService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);

    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }

  ngOnInit(): void {
    this.lockoutService.isLockedOut().subscribe(isLocked => {
      if (isLocked) {
        console.log('Bloqueo activo detectado');
      }
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.isEmailSent = false;
    this.pendingUserData = null;
  }

  onSubmit(form: any): void {
    if (!form.valid) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const { nombre, email, password, direccion, telefono } = form.value;

    if (this.containsInjectionAttempt(nombre)) {
      alert('⚠️ Eso no se permite, por favor coloca bien los datos. El nombre solo puede contener letras y espacios.');
      return;
    }

    if (this.containsInjectionAttempt(direccion)) {
      alert('⚠️ Eso no se permite, por favor coloca bien los datos. La dirección contiene caracteres no permitidos.');
      return;
    }

    if (this.containsInjectionAttempt(telefono)) {
      alert('⚠️ Eso no se permite, por favor coloca bien los datos. El teléfono solo puede contener números y símbolos básicos.');
      return;
    }

    if (this.containsInjectionAttempt(email)) {
      alert('⚠️ Eso no se permite, por favor coloca bien los datos. El email contiene caracteres no permitidos.');
      return;
    }

    if (/\d/.test(nombre)) {
      alert('El nombre no puede contener números.');
      return;
    }

    if (!this.isLoginMode && !/^\d{10}$/.test(telefono)) {
      alert('El número de teléfono debe tener 10 dígitos y contener solo números.');
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      alert('Formato de correo inválido. Solo se permiten correos @gmail.com');
      return;
    }

    if (!this.isLoginMode) {
      const securityLevel = this.getPasswordSecurityLevel(password);
      if (securityLevel === 'Débil') {
        alert('La contraseña es débil. Por favor, elige una contraseña más segura.');
        return;
      }
    }

    const userData = { nombre, email, contrasena: password, direccion, telefono };

    if (this.isLoginMode) {
      this.login({ email, contrasena: password });
    } else {
      this.registerWithEmail(userData);
    }
  }

  private containsInjectionAttempt(value: string): boolean {
    if (!value) return false;
    
    const injectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT|ALERT|JAVASCRIPT|VBSCRIPT)\b)/i,
      /(--|#|\/\*|\*\/|xp_)/i,
      /('|"|`|\\|\/|%|;|>|<|<|>|&amp;)/i,
      /\b(OR|AND)\s+\d+\s*=\s*\d+/i,
      /\b(OR|AND)\s+['"][^'"]*['"]\s*=\s*['"][^'"]*['"]/i,
      /(\bTRUE\b|\bFALSE\b)/i,
      /(\bNULL\b|\bNULLIF\b)/i,
      /(\bCHAR\b|\bNCHAR\b|\bVARCHAR\b|\bNVARCHAR\b)/i,
      /(\bCAST\b|\bCONVERT\b)/i,
      /(\bWAITFOR\b|\bDELAY\b)/i
    ];

    return injectionPatterns.some(pattern => pattern.test(value));
  }

  private getPasswordSecurityLevel(password: string): string {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const checksPassed = [hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    if (password.length < minLength || checksPassed <= 1) {
      return 'Débil';
    } else if (checksPassed === 2) {
      return 'Media';
    } else {
      return 'Fuerte';
    }
  }

  private registerWithEmail(userData: any): void {
    this.apiService.register(userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado exitosamente:', response);
        alert('Usuario registrado exitosamente. Por favor verifica tu correo.');
        this.isEmailSent = true;
        this.pendingUserData = userData;
        this.toggleMode(); 
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        
        if (error.status === 409) {
          const errorMessage = error.error?.message || 'Este correo ya está registrado.';
          alert(errorMessage);
        } else {
          alert('Error al registrar usuario: ' + (error.error?.message || error.message));
        }
      }
    });
  }

  private login(formData: LoginData): void {
    this.apiService.login(formData).subscribe({
      next: ({ token, userId }) => {
        this.lockoutService.clearLockout();
        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          window.dispatchEvent(new CustomEvent('auth:login'));
        }
        this.cartService.loadCart();
        this.router.navigate(['/']);
      },
      error: (error) => {
        if (error.status === 429) {
          this.lockoutService.recordFailedAttempt();
          return;
        }
        
        if (error.status === 401) {
          this.lockoutService.recordFailedAttempt();
          
          const errorMessage = error.error?.error || error.error?.message || 'Credenciales incorrectas';
          
          if (errorMessage.includes('Correo no verificado') || errorMessage.includes('verifica tu correo')) {
            alert('⚠️ Necesitas verificar tu correo electrónico antes de iniciar sesión. Por favor revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.');
            return;
          }
          
          if (errorMessage.includes('EMAIL_EXISTS')) {
            alert('Este correo ya está registrado. Por favor, inicia sesión o utiliza un correo diferente.');
            return;
          }
          
          alert('Credenciales incorrectas. Inténtalo de nuevo.');
        } else if (error.status === 405) {
          alert('Error: Método no permitido. Verifica la configuración del servidor.');
        } else {
          this.lockoutService.recordFailedAttempt();
          alert('Credenciales incorrectas. Inténtalo de nuevo.');
        }
      }
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.cartService.clearCart();
    this.router.navigate(['/auth']);
  }

  resendVerificationEmail(email: string): void {
    if (!email) {
      alert('Por favor, ingresa tu correo electrónico para reenviar la verificación.');
      return;
    }

    this.apiService.resendVerificationEmail(email).subscribe({
      next: (response) => {
        alert('Correo de verificación reenviado exitosamente. Por favor revisa tu bandeja de entrada.');
      },
      error: (error) => {
        alert('Error al reenviar el correo de verificación. Por favor, intenta nuevamente.');
      }
    });
  }
}
