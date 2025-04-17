import { Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Oturum sonlandı, giriş sayfasına yönlendir
        router.navigate(['/auth/login']);
      }
      
      // Hata mesajını kullanıcıya gösterebilirsiniz
      const errorMessage = error.error?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      console.error('API Error:', errorMessage);
      
      return throwError(() => error);
    })
  );
};