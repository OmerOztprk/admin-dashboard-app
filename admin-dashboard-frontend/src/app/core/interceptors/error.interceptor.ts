import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Bilinmeyen bir hata oluştu.';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Hata: ${error.error.message}`;
        } else if (error.status === 0) {
          // Network error - sunucuya bağlanılamadı
          errorMessage = 'Sunucuya bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun.';
          console.error('Backend sunucusuna bağlantı kurulamadı:', error);
        } else {
          // Server-side error
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status) {
            switch (error.status) {
              case 400:
                errorMessage = 'Geçersiz istek.';
                break;
              case 401:
                errorMessage = 'Yetkilendirme hatası. Lütfen tekrar giriş yapın.';
                break;
              case 403:
                errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
                break;
              case 404:
                errorMessage = 'İstenen kaynak bulunamadı.';
                break;
              case 500:
                errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
                break;
              default:
                errorMessage = `Sunucu hatası: ${error.status}`;
                break;
            }
          }
        }
        
        // Burada notification service ekleyebilirsiniz
        console.error('HTTP Error:', errorMessage);
        
        return throwError(() => ({
          error: error.error,
          status: error.status,
          message: errorMessage
        }));
      })
    );
  }
}