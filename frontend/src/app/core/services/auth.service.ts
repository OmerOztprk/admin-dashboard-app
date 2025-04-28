import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, RegisterRequest, Login2FAResponse } from '../models/auth.model';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(true); // ⭐ loading state
  public readonly loading$ = this.loadingSubject.asObservable();

  private pending2FAUserId: string | null = null;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<User | Login2FAResponse> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(res => this.log('Login yanıtı', res)),
      map(res => {
        if (res.code !== 200 || !res.data) throw new Error(res.message || 'Giriş başarısız.');
        if (res.data.step === '2fa') {
          this.pending2FAUserId = res.data.userId;
          return { step: '2fa', userId: res.data.userId } as Login2FAResponse;
        }
        this.handleLoginSuccess(res.data.token, res.data.user);
        return this.mapToUser(res.data.user);
      }),
      catchError(err => this.handleHttpError(err, 'Kimlik doğrulama hatası.'))
    );
  }

  verifyCode(code: string): Observable<User> {
    if (!this.pending2FAUserId) {
      return throwError(() => new Error('2FA oturumu bulunamadı, tekrar giriş yapın.'));
    }

    return this.http.post<ApiResponse<any>>(`${this.API_URL}/auth/verify-code`, {
      userId: this.pending2FAUserId,
      code
    }).pipe(
      map(res => {
        if (res.code !== 200 || !res.data) throw new Error(res.message || 'Kod doğrulanamadı.');
        this.handleLoginSuccess(res.data.token, res.data.user);
        this.pending2FAUserId = null;
        return this.mapToUser(res.data.user);
      }),
      catchError(err => this.handleHttpError(err, 'Kod doğrulama hatası.'))
    );
  }

  register(data: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/auth/register`, data).pipe(
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
        if (err.status === 401 || err.status === 403) this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.tokenService.removeTokens();
    this.currentUserSubject.next(null);
    this.loadingSubject.next(false); // ⭐
    this.pending2FAUserId = null;
    if (this.router.url !== '/auth/login') {
      this.router.navigate(['/auth/login']);
    }
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.token && !this.tokenService.isTokenExpired();
  }

  hasPermission(permission: string): boolean {
    return this.currentUserSubject.value?.permissions?.includes(permission) || false;
  }

  private handleLoginSuccess(token: string, rawUser: any): void {
    this.tokenService.setTokens(token);
    const user = this.mapToUser(rawUser);
    this.currentUserSubject.next(user);
    this.loadingSubject.next(false); // ⭐ kullanıcı geldiğinde loading bitir
  }

  private loadCurrentUser(): void {
    const token = this.tokenService.token;
    if (token && !this.tokenService.isTokenExpired()) {
      this.getUserProfile().subscribe({
        next: user => {
          this.currentUserSubject.next(user);
          this.loadingSubject.next(false);
        },
        error: err => {
          this.logout();
        }
      });
    } else {
      this.loadingSubject.next(false);
      this.logout();
    }
  }


  private mapToUser(raw: any): User {
    return {
      _id: raw._id,
      email: raw.email,
      first_name: raw.first_name ?? '',
      last_name: raw.last_name ?? '',
      phone_number: raw.phone_number ?? '',
      is_active: raw.is_active ?? true,
      language: raw.language ?? 'TR',
      roles: raw.roles ?? [],
      permissions: raw.permissions ?? [],
      created_at: raw.created_at ?? '',
      updated_at: raw.updated_at ?? ''
    };
  }

  private handleHttpError(error: any, fallback: string) {
    const message = error?.error?.message || fallback;
    return throwError(() => new Error(message));
  }

  private log(label: string, data?: any): void {
    if (!environment.production) {
      console.log(`[AuthService] ${label}:`, data);
    }
  }
}
