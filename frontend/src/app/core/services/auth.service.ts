import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const token = this.tokenService.token;
    if (token && !this.tokenService.isTokenExpired()) {
      this.getUserProfile().subscribe({
        next: user => this.log('Kullanıcı yüklendi', user),
        error: err => {
          this.log('Profil yüklenemedi', err);
          if (!(err.status === 0 || err.statusText === 'Unknown Error')) {
            this.logout();
          }
        }
      });
    } else if (token) {
      this.log('Token süresi dolmuş, çıkış yapılıyor');
      this.tokenService.removeTokens();
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    this.log('Login isteği', credentials);

    return this.http.post<ApiResponse<{ token: string; user: any }>>(
      `${this.API_URL}/auth/login`, credentials
    ).pipe(
      tap(res => this.log('Login yanıtı', res)),
      map(res => {
        if (res.code === 200 && res.data) {
          this.tokenService.setTokens(res.data.token);
          const user = this.mapToUser(res.data.user);
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error(res.message || 'Giriş başarısız.');
      }),
      catchError(err => this.handleHttpError(err, 'Kimlik doğrulama hatası.'))
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<any>>(
      `${this.API_URL}/auth/register`, data
    ).pipe(
      switchMap(res => {
        if (res.code === 200 && res.data) {
          return this.login({ email: data.email, password: data.password });
        }
        throw new Error(res.message || 'Kayıt başarısız.');
      }),
      catchError(err => this.handleHttpError(err, 'Kayıt sırasında hata oluştu.'))
    );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/users/profile`).pipe(
      map(res => {
        if (res.code === 200 && res.data) {
          this.currentUserSubject.next(res.data);
          return res.data;
        }
        throw new Error(res.message || 'Profil alınamadı.');
      }),
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          this.logout(); // sadece gerçekten yetki hatası varsa logout
        } else {
          console.warn('[AuthService] Profil alınamadı ama logout yapılmadı:', err);
        }
        return throwError(() => err);
      })
    );
  }


  logout(): void {
    this.tokenService.removeTokens();
    this.currentUserSubject.next(null);
    if (this.router.url !== '/auth/login') {
      this.router.navigate(['/auth/login']);
    }
  }

  refreshToken(): Observable<any> {
    return of({ token: this.tokenService.token });
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.token && !this.tokenService.isTokenExpired();
  }

  hasPermission(permission: string): boolean {
    return this.currentUserSubject.value?.permissions?.includes(permission) || false;
  }

  private mapToUser(raw: any): User {
    return {
      _id: raw._id,
      email: raw.email,
      first_name: raw.first_name || '',
      last_name: raw.last_name || '',
      phone_number: raw.phone_number || '',
      is_active: raw.is_active ?? true,
      roles: raw.roles || [], // string[] olmalı
      permissions: raw.permissions || [],
      created_at: raw.created_at || '',
      updated_at: raw.updated_at || ''
    };
  }

  private handleHttpError(error: any, fallback: string) {
    const message = error?.error?.message || fallback;
    if (error.status === 0) {
      return throwError(() => new Error('Sunucuya ulaşılamadı.'));
    }
    return throwError(() => new Error(message));
  }

  private log(label: string, data?: any): void {
    if (!environment.production) {
      console.log(`[AuthService] ${label}:`, data);
    }
  }
}
