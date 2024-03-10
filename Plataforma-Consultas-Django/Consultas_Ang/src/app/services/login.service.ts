import { Injectable } from '@angular/core';
import { LoginRequest, LoginRequest2 } from '../models/loginRequest';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  catchError,
  throwError,
  BehaviorSubject,
  forkJoin,
} from 'rxjs';
import { User } from '../models/user';
import { BankData } from '../models/bankData';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.isUserLoggedIn()
  );
  currentUserData: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private apiUrl = 'http://localhost:8000/api/usuarios/';
  constructor(private http: HttpClient) { }

  getUsers(token: string): Observable<User[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  getUserAutenticado(token: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<User>(`${this.apiUrl}me/`, { headers });
  }


  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`http://127.0.0.1:8000/api/usuarios/?username=${username}`);
  }


  getUsersByPromotor(promotor: string, token: string): Observable<User[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<User[]>(
      `http://localhost:8000/api/usuarios?promotor__nombre=${promotor}`, { headers }
    );
  }

  getPromotores(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any[]>(`http://localhost:8000/api/promotores/`, { headers });
  }
  


  getPromotorData(promotor: string, token: string): Observable<BankData[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    promotor = promotor.toLowerCase();
    return this.http.get<BankData[]>(
      `http://127.0.0.1:8000/api/aportaciones/?promotor=${promotor}`, { headers }
    );
  }
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('option');
    this.currentUserLoginOn.next(false);
    this.currentUserData.next([]);
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  login2(credentials: LoginRequest2): Observable<string> {
    return this.http.post<any>('http://localhost:8000/api-token-auth/', credentials).pipe(
      map((response) => {
        const token = response.token;
        if (token) {
          console.log('Token service :', token);
          this.currentUserLoginOn.next(true);
          // Guarda el token del usuario en localStorage
          localStorage.setItem('currentUser', token);
          return token;
        } else {
          throw new Error('Credenciales inválidas. Por favor, intente de nuevo.');
        }
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUserLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }


  getTodosLosPromotores(token: string): Observable<BankData[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<BankData[]>('http://127.0.0.1:8000/api/aportaciones/', { headers });
  }
  


  getDatosUsuario2(token: string): Observable<BankData[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http
      .get<any[]>('http://localhost:8000/api/aportaciones/', { headers })
      .pipe(catchError(this.handleError));
  }

  getDatosUsuario(username: string, token: string): Observable<BankData[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http
      .get<any[]>(`http://localhost:8000/api/aportaciones/?usuario=${username}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getDatosEntidadPorNombre(nombre: string,token: string): Observable<BankData[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http
      .get<BankData[]>(`http://localhost:8000/api/aportaciones/?entidad=${nombre}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getEntidades(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any[]>(`http://localhost:8000/api/entidades/`, { headers });
  }
  

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error(
        `Backend retornó código de estado: ${error.status}, ` +
        `error: ${error.error}`
      );
    }
    return throwError(() => error);
  }
}
