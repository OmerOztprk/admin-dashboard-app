import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  get token(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  removeTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const token = this.token;
    if (!token) return true;

    try {
      const base64 = token.split('.')[1];
      const decoded = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
      return Date.now() >= decoded.exp * 1000;
    } catch (e) {
      if (!environment.production) {
        console.warn('Token parse hatası:', e);
      }
      return true;
    }
  }

  // İsteğe bağlı: Token süresine kalan zamanı milisaniye cinsinden verir
  getTokenRemainingTime(): number | null {
    const token = this.token;
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.exp * 1000) - Date.now();
    } catch {
      return null;
    }
  }
}
