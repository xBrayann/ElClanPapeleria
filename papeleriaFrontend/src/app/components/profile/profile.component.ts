import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  categories: any[] = []; 

  user: any;
  editMode = false;
  loading = true; 
  errorMessage: string | null = null; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.apiService.getCategorias().subscribe({ 
      next: (data) => {
        this.categories = data;
        console.log(this.categories); 
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Error al cargar las categorías. Por favor, inténtelo de nuevo más tarde.'; // Mensaje de error
        this.loading = false;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('Sesión cerrada correctamente.');
    window.location.reload(); // Actualizar la página
  }


  loadUserProfile(): void {

    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null; // Check if running in the browser

    if (userId) {
      this.apiService.getUsuarioById(userId).subscribe({
        next: (data) => {
          this.user = data;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false; 
          this.errorMessage = 'Error al cargar el perfil. Por favor, inténtelo de nuevo más tarde.'; // Mensaje de error
        }
      });
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveProfile(): void { 
    this.errorMessage = null; 

    this.apiService.updateUsuario(this.user.id, this.user).subscribe({
      next: () => {
        this.toggleEditMode();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Error al actualizar el perfil. Por favor, inténtelo de nuevo más tarde.'; // Mensaje de error
      }
    });
  }
}
