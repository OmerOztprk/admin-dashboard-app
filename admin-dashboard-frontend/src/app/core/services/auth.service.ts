import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    TokenPayload,
    RefreshTokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest
} from '../models/auth.model';
import { SystemPermissions } from '../models/role.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:5000/api';
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user_data';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Sayfa yüklendiğinde token ve kullanıcı bilgisini kontrol et
        this.loadUserFromStorage();

        // Token süre kontrolünü başlat
        this.initTokenExpirationCheck();
    }

    // Depolama alanından kullanıcıyı yükle
    private loadUserFromStorage(): void {
        const token = this.getToken();
        const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);

        if (token && userData && userData !== 'undefined') {
            try {
                const user = JSON.parse(userData) as User;
                this.currentUserSubject.next(user);
            } catch (error) {
                // Parse hatası olursa, storage'ı temizle
                console.error('Kullanıcı verisi parse edilemedi:', error);
                this.logout(); // Bozuk verileri temizle
            }
        }
    }

    // Token süresini düzenli kontrol et
    private initTokenExpirationCheck(): void {
        // Her 5 dakikada bir token süresini kontrol et
        setInterval(() => this.checkTokenExpiration(), 5 * 60 * 1000);
    }

    // Giriş işlemi
    login(credentials: LoginRequest, rememberMe = false): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    // RememberMe seçeneğine göre storage seç
                    const storage = rememberMe ? localStorage : sessionStorage;

                    // Token ve kullanıcı bilgisini seçilen storage'a sakla
                    storage.setItem(this.TOKEN_KEY, response.token);
                    storage.setItem(this.USER_KEY, JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                }),
                catchError(error => {
                    console.error('Login error:', error);
                    return throwError(() => new Error(error.error?.message || 'Giriş başarısız oldu'));
                })
            );
    }

    // Kayıt işlemi
    register(userData: RegisterRequest): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.API_URL}/auth/register`, userData)
            .pipe(
                catchError(error => {
                    console.error('Register error:', error);
                    return throwError(() => new Error(error.error?.message || 'Kayıt işlemi başarısız oldu'));
                })
            );
    }

    // Çıkış işlemi
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    // Token kontrolü
    isAuthenticated(): boolean {
        return !!(localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY));
    }

    // Token'ı getir
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    }

    // Kullanıcı adını getir
    getUserFullName(): string {
        const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
        if (userData) {
            try {
                const user = JSON.parse(userData) as User;
                return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
            } catch (e) {
                return '';
            }
        }
        return '';
    }

    // Kullanıcı bilgisini getir
    getCurrentUser(): User | null {
        const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
        if (userData) {
            try {
                return JSON.parse(userData) as User;
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // Kullanıcının belirli bir rolü var mı?
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();

        if (!user || !user.roles) return false;

        if (Array.isArray(user.roles)) {
            // Roller dizi olarak geliyorsa
            if (typeof user.roles[0] === 'string') {
                return (user.roles as string[]).includes(role);
            }
            // Roller obje olarak geliyorsa
            return (user.roles as any[]).some(r => r.role_name === role);
        }

        return false;
    }

    // Kullanıcının izinlerini kontrol et
    hasPermission(permission: SystemPermissions): boolean {
        // Admin kullanıcısına tüm izinleri ver
        if (this.hasRole('ADMIN')) return true;

        // Token içindeki izinleri kontrol et
        const token = this.getToken();
        if (token) {
            try {
                const tokenData = this.decodeToken(token);
                // TokenPayload içinde permissions alanı olduğunu varsayıyoruz
                return tokenData?.permissions?.includes(permission) || false;
            } catch (e) {
                return false;
            }
        }

        return false;
    }

    // Kullanıcı profilini güncelle
    updateProfile(userData: Partial<User>): Observable<User> {
        return this.http.post<User>(`${this.API_URL}/users/update-profile`, userData)
            .pipe(
                tap(updatedUser => {
                    // Mevcut kullanıcı bilgilerini güncelle
                    const currentUser = this.getCurrentUser();
                    if (currentUser) {
                        const newUserData = { ...currentUser, ...updatedUser };

                        // Storage'da güncelle
                        if (localStorage.getItem(this.TOKEN_KEY)) {
                            localStorage.setItem(this.USER_KEY, JSON.stringify(newUserData));
                        }

                        if (sessionStorage.getItem(this.TOKEN_KEY)) {
                            sessionStorage.setItem(this.USER_KEY, JSON.stringify(newUserData));
                        }

                        this.currentUserSubject.next(newUserData);
                    }
                }),
                catchError(error => {
                    console.error('Update profile error:', error);
                    return throwError(() => new Error(error.error?.message || 'Profil güncellenemedi'));
                })
            );
    }

    // Token süresini kontrol et
    checkTokenExpiration(): void {
        const token = this.getToken();
        if (!token) return;

        // JWT token'ı decode et
        const tokenData = this.decodeToken(token);
        if (!tokenData) return;

        // Token süresi dolmak üzere mi kontrol et
        const expiresIn = tokenData.exp - Math.floor(Date.now() / 1000);

        // Token'ın süresi 5 dakikadan az kaldıysa yenile
        if (expiresIn < 300) {
            this.refreshToken();
        }

        // Token süresi dolduysa çıkış yap
        if (expiresIn <= 0) {
            this.logout();
        }
    }

    private decodeToken(token: string): TokenPayload | null {
        try {
            // JWT token parçalama
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch (e) {
            return null;
        }
    }

    refreshToken(): void {
        // Backend'inizde token yenileme endpoint'i olmalı
        this.http.post<RefreshTokenResponse>(`${this.API_URL}/auth/refresh-token`, {})
            .subscribe({
                next: response => {
                    // Token yeniledikten sonra storage güncelle
                    if (localStorage.getItem(this.TOKEN_KEY)) {
                        localStorage.setItem(this.TOKEN_KEY, response.token);

                        // Eğer response'da user verisi de varsa onu da güncelle
                        if (response.user) {
                            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
                            this.currentUserSubject.next(response.user);
                        }
                    }
                    if (sessionStorage.getItem(this.TOKEN_KEY)) {
                        sessionStorage.setItem(this.TOKEN_KEY, response.token);

                        // Eğer response'da user verisi de varsa onu da güncelle
                        if (response.user) {
                            sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
                            this.currentUserSubject.next(response.user);
                        }
                    }
                },
                error: () => this.logout() // Yenilemede hata olursa çıkış yap
            });
    }

    // Şifremi unuttum
    forgotPassword(email: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.API_URL}/auth/forgot-password`, { email })
            .pipe(
                catchError(error => {
                    console.error('Forgot password error:', error);
                    return throwError(() => new Error(error.error?.message || 'Şifre sıfırlama isteği başarısız oldu'));
                })
            );
    }

    // Şifre sıfırlama
    resetPassword(token: string, newPassword: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.API_URL}/auth/reset-password`, {
            token,
            password: newPassword
        }).pipe(
            catchError(error => {
                console.error('Reset password error:', error);
                return throwError(() => new Error(error.error?.message || 'Şifre sıfırlama başarısız oldu'));
            })
        );
    }

    // Oturum kontrol servisi - Guard'lar için
    checkAuth(): Observable<boolean> {
        if (this.isAuthenticated()) {
            return this.http.get<{ authenticated: boolean }>(`${this.API_URL}/auth/check`)
                .pipe(
                    tap(response => {
                        if (!response.authenticated) {
                            this.logout();
                        }
                    }),
                    catchError(() => {
                        this.logout();
                        return throwError(() => new Error('Oturum doğrulanamadı'));
                    }),
                    // Boolean değere dönüştür
                    map(response => response.authenticated)
                );
        } else {
            this.logout();
            return throwError(() => new Error('Token bulunamadı'));
        }
    }
}