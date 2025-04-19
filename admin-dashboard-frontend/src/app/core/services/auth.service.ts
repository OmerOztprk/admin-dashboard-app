import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
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
    const token = this.tokenService.getToken();

    if (token) {
      this.getUserProfile().subscribe();
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    console.log('Login isteği gönderiliyor:', credentials);

    return this.http.post<any>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => console.log('Backend yanıtı:', response)), // Tam yanıtı logla
      map(response => {
        // Başarılı yanıtta code=200 ve data var mı kontrol et
        if (response && response.code === 200 && response.data) {
          console.log('Login başarılı, veri:', response.data);

          // Backend sadece token dönüyor, refreshToken dönmüyor
          this.tokenService.setTokens(response.data.token, '');

          // Backend'den gelen user verisini User modeline dönüştür
          const user: User = {
            _id: response.data.user.id,
            username: response.data.user.first_name || '',
            email: response.data.user.email,
            fullName: `${response.data.user.first_name || ''} ${response.data.user.last_name || ''}`.trim(),
            role: 'user',
            permissions: response.data.user.roles || [], // Backend'den rol bilgisi geliyorsa
            createdAt: '',
            updatedAt: ''
          };

          this.currentUserSubject.next(user);
          return user;
        } else if (response && response.code !== 200) {
          // Başarısız yanıt (code != 200)
          console.error('Login başarısız, sunucu yanıtı:', response);
          throw new Error(response.message || 'Giriş başarısız. Sunucu hatası.');
        } else {
          // Beklenmeyen yanıt formatı
          console.error('Beklenmeyen sunucu yanıtı:', response);
          throw new Error('Beklenmeyen sunucu yanıtı. Lütfen daha sonra tekrar deneyin.');
        }
      }),
      catchError(error => {
        console.error('Login isteği hatası:', error.message, error);

        // HTTP hatası mı yoksa uygulama hatası mı kontrol et
        if (error.status === 0) {
          return throwError(() => new Error('Sunucuya bağlanılamadı. Backend servisinin çalıştığından emin olun.'));
        } else if (error.error) {
          return throwError(() => new Error(error.error.message || 'Kimlik doğrulama hatası.'));
        }

        return throwError(() => error);
      })
    );
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/auth/register`, registerData).pipe(
      // map yerine switchMap kullanılmalı - bu iç içe Observable problemini çözer
      switchMap(response => {
        if (response.success) {
          // Başarılı kayıttan sonra otomatik login yapalım
          return this.login({
            email: registerData.email,
            password: registerData.password
          });
        }
        throw new Error(response.message || 'Registration failed');
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/users/profile`).pipe(
      map(response => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
          return response.data;
        }
        throw new Error(response.message || 'Failed to get user profile');
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.tokenService.removeTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<any> {
    // Backend şu anda refresh token desteği sağlamıyor
    // Bu fonksiyonu geçici olarak başarılı kabul edelim
    return of({ token: this.tokenService.getToken() });
  }

  isAuthenticated(): boolean {
    return this.tokenService.getToken() !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions?.includes(permission) || false;
  }
}