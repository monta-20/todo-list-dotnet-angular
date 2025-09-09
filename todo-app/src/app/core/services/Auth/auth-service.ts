import { Injectable } from '@angular/core';
import { AuthRequest, AuthResponse } from '../../../models/Auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.ApiUrl}/auth`;

  private loggedIn = new BehaviorSubject<boolean>(!!this.getToken());
  loggedIn$ = this.loggedIn.asObservable();
  constructor(private http: HttpClient) { }

  // SIGN UP
  signUp(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request);
  }

  // SIGN IN
  signIn(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, request);
  }

  // GOOGLE LOGIN
  googleLogin(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, request);
  }

  // GET CURRENT USER
  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`);
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
    this.loggedIn.next(true);
  }

  clearToken() {
    localStorage.removeItem('jwt');
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}
