import { HttpInterceptorFn } from '@angular/common/http';
import { inject, runInInjectionContext, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError(error => {
      // Only get AuthService when needed, not during initialization
      if (error.status === 401) {
        // Use runInInjectionContext to safely get the AuthService only when needed
        runInInjectionContext(injector, () => {
          const authService = inject(AuthService);
          authService.logout();
        });
        router.navigate(['/auth/login']);
      }
      
      // 403 Forbidden hatası
      if (error.status === 403) {
        router.navigate(['/dashboard']);
      }
      
      // Sunucudan dönen hata mesajını kullan
      const errorMessage = error.error?.message || error.statusText || 'Bilinmeyen hata';
      
      return throwError(() => ({
        status: error.status,
        message: errorMessage
      }));
    })
  );
};