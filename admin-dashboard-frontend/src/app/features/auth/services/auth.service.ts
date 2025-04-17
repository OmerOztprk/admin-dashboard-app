import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../../core/models/auth.model';
import { User } from '../../../core/models/user.model';
import { SystemPermissions } from '../../../core/models/role.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    hasPermission // Parse hatası olursa, storage'ı temizle
        (permission: SystemPermissions): boolean {
            throw new Error('Method not implemented.');
    }
    getUserFullName(): string {
        throw new Error('Method not implemented.');
    }
    private readonly API_URL = 'http://localhost:5000/api';
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user_data';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        // Sayfa yüklendiğinde token ve kullanıcı bilgisini kontrol et
        this.loadUserFromStorage();
    }

    // Depolama alanından kullanıcıyı yükle
    private loadUserFromStorage(): void {
        // localStorage ve sessionStorage'ı kontrol et
        const token = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
        const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);

        // userData null veya undefined olmadığından emin ol
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
                })
            );
    }

    // Kayıt işlemi
    register(userData: RegisterRequest): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.API_URL}/auth/register`, userData);
    }

    // Çıkış işlemi
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    // Token kontrolü
    isAuthenticated(): boolean {
        return !!(localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY));
    }

    // Token'ı getir
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    }
}