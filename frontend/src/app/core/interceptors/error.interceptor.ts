import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error?.status === 401) {
        runInInjectionContext(injector, () => {
          const authService = inject(AuthService);
          authService.logout();
        });
        router.navigate(['/auth/login'], { queryParams: { sessionExpired: true } });
      }

      if (error?.status === 403) {
        router.navigate(['/dashboard'], { queryParams: { forbidden: true } });
      }

      const errorMessage = error?.error?.message || 'Sunucu hatası';
      return throwError(() => ({
        status: error?.status,
        message: errorMessage
      }));
    })
  );
};
