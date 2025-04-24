import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Kimlik gerektirmeyen endpoint’ler
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/verify-code')
  ) {
    return next(req);
  }

  const token = tokenService.token;
  if (!token) return next(req);

  if (tokenService.isTokenExpired()) {
    tokenService.removeTokens();
    router.navigate(['/auth/login']);
    return throwError(() => new Error('Token süresi doldu'));
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })
  );
};
