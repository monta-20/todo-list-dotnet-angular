import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class Auth2 {
  constructor(private http: HttpClient) { }
  private apiUrl = environment.ApiUrl;
  loginWithGoogle() {
    // Redirige l'utilisateur vers l'API .NET (ouvre Google Login)
    window.location.href = `${this.apiUrl}/loginAuth2.0`;
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }
}
