import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { ApiService } from '../../services/api.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-opiniones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Asegurar que FormsModule esté disponible

  templateUrl: './opiniones.component.html',
  styleUrls: ['./opiniones.component.css']
})
export class OpinionesComponent implements OnInit {
  opiniones: any[] = [];
    nuevaOpinion = { 
        UsuarioId: localStorage.getItem('userId') || '', // Obtener el ID del usuario autenticado desde localStorage
        Nombre: '', // Nuevo campo para el nombre del usuario
        Calificacion: 0, 
        Comentario: '', 
        Fecha: new Date() 
    };












  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerOpiniones();
  }

  obtenerOpiniones(): void {
    this.apiService.getOpiniones().subscribe((opiniones: any[]) => {
      this.opiniones = opiniones.map(opinion => ({
        usuarioId: opinion.usuarioId,
        Nombre: opinion.nombre,
        calificacion: opinion.calificacion,
        comentario: opinion.comentario,
        fecha: opinion.fecha
      }));


    }, error => {
      console.error('Error al obtener opiniones:', error); // Manejo de errores
    });

  }

  registrarOpinion(): void {
    console.log('Registrando opinión:', this.nuevaOpinion); // Agregar log para verificar datos

    this.apiService.registrarOpinion(this.nuevaOpinion).subscribe(() => {
      this.obtenerOpiniones();
      this.nuevaOpinion = { 
        UsuarioId: localStorage.getItem('userId') || '', // Mantener el ID del usuario autenticado
        Nombre: '', // Nuevo campo para el nombre del usuario
        Calificacion: 0, 
        Comentario: '', 
        Fecha: new Date() 
      }; // Limpiar el formulario
    }, error => {
      console.error('Error al registrar opinión:', error); // Manejo de errores
    });
  }
}
