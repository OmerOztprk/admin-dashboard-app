import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly API_URL = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getAuditLogStats(): Observable<any[]> {
    return this.http.post<ApiResponse<any[]>>(`${this.API_URL}/auditlogs`, {}).pipe(
      map(res => res.data!), // <- burada ! kullanıyoruz
      catchError(this.handleHttpError('Audit Log stats alınamadı'))
    );
  }

  getUniqueCategoryStats(): Observable<{ categories: string[]; count: number }> {
    return this.http.post<ApiResponse<{ categories: string[]; count: number }>>(`${this.API_URL}/categories/unique`, {}).pipe(
      map(res => res.data!), // <- burada da ! kullanıyoruz
      catchError(this.handleHttpError('Kategori stats alınamadı'))
    );
  }

  getUserCountStats(): Observable<{ count: number }> {
    return this.http.post<ApiResponse<{ count: number }>>(`${this.API_URL}/users/count`, {}).pipe(
      map(res => res.data!), // <- burada da !
      catchError(this.handleHttpError('Kullanıcı stats alınamadı'))
    );
  }

  private handleHttpError(fallbackMessage: string) {
    return (error: any) => {
      const message = error?.error?.message || fallbackMessage;
      return throwError(() => new Error(message));
    };
  }
}
