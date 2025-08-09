import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5100/api';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`).pipe(
      tap({
        next: (data) => console.log('Categorías obtenidas:', data.length),
        error: (err) => console.error('Error obteniendo categorías:', err)
      }),
      catchError(error => {
        console.error('Error en la solicitud de categorías:', error);
        return of([]);
      })
    );
  }

  getMetodosPago(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/metodopago`).pipe(
      tap({
        next: (data) => console.log('Métodos de pago obtenidos:', data.length),
        error: (err) => console.error('Error obteniendo métodos de pago:', err)
      }),
      catchError(error => {
        console.error('Error en la solicitud de métodos de pago:', error);
        return of([]);
      })
    );
  }

  getMetodoPagoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/metodopago/${id}`);
  }

  addMetodoPago(metodoPago: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/metodopago`, metodoPago);
  }

  updateMetodoPago(id: string, metodoPago: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/metodopago/${id}`, metodoPago);
  }

  deleteMetodoPago(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/metodopago/${id}`);
  }

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  getOrdenes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ordenes`);
  }

  getProveedores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/proveedor`);
  }

  getMarcas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/marca`);
  }

  getUsuarioById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }

  updateUsuario(id: string, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${id}`);
  }

  login(credentials: { email: string, contrasena: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/login`, credentials)
      .pipe(
        tap((response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  register(userData: { 
    nombre: string, 
    email: string, 
    contrasena: string,
    direccion: string,
    telefono: string,
    firebaseToken: string
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, userData);
  }

  // Método para obtener todas las opiniones
  getOpiniones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/opiniones`).pipe(
      tap({
        next: (data) => console.log('Opiniones obtenidas:', data.length),
        error: (err) => console.error('Error obteniendo opiniones:', err)
      }),
      catchError(error => {
        console.error('Error en la solicitud de opiniones:', error);
        return of([]);
      })
    );
  }

  // Método para registrar una nueva opinión
  registrarOpinion(opinion: { 
    UsuarioId: string, 
    Nombre: string, // Agregar campo Nombre
    Calificacion: number, 
    Comentario: string, 
    Fecha: Date 
  }): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/opiniones`, {
      UsuarioId: opinion.UsuarioId,
      Nombre: opinion.Nombre, // Incluir campo Nombre
      Calificacion: opinion.Calificacion,
      Comentario: opinion.Comentario,
      Fecha: opinion.Fecha
    }).pipe(

      tap(response => console.log('Respuesta del servidor al registrar opinión:', response)),
      catchError(error => {
        console.error('Error al registrar opinión:', error);
        return of(null);
      })
    );
  }

  createPreference(preference: any): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { 'Authorization': `Bearer ${token}` };
    }
    return this.http.post<any>(`${this.apiUrl}/mercadopago/create_preference`, preference, { headers: headers });
  }

  createOrder(order: any): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { 'Authorization': `Bearer ${token}` };
    }
    return this.http.post<any>(`${this.apiUrl}/paypal/create_order`, order, { headers: headers });
  }

  // Removed sendVerificationCode and verifyCode methods as Firebase Authentication is used for phone verification now
  
  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/reenviar-verificacion`, `"${email}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
