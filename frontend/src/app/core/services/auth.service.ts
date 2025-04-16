import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  hasRole(role: string): unknown {
      throw new Error('Method not implemented.');
  }
  private readonly TOKEN_KEY = 'token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    );
  }

  register(email: string, password: string, otherData?: any) {
    return this.http.post<{ success: boolean }>(
      `${environment.apiUrl}/auth/register`,
      { email, password, ...otherData }
    );
  }

  // Token'ı localStorage'da veya sessionStorage'da saklıyoruz
  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // token var mı?
  }

  logout() {
    this.removeToken();
    this.router.navigate(['/auth/login']);
  }
}
