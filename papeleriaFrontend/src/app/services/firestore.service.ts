import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private apiUrl = 'http://localhost:5100';

  constructor(private http: HttpClient) {}

  createUserInFirestore(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/usuarios`, userData);
  }

  checkUserInFirestore(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/usuarios/email/${email}`);
  }
}
