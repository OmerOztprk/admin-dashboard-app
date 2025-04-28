import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuditLog } from '../models/audit-log.model';
import { ApiResponse } from '../models/api-response.model';

interface FetchLogsParams {
  begin_date?: Date | string;
  end_date?: Date | string;
  skip?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class AuditLogsService {
  private readonly API_URL = `${environment.apiUrl}/auditlogs`;

  constructor(private http: HttpClient) {}

  fetchLogs(params: FetchLogsParams = {}): Observable<AuditLog[]> {
    return this.http.post<ApiResponse<AuditLog[]>>(this.API_URL, params).pipe(
      map(res => {
        if (!res.data) throw new Error('Audit log verisi bulunamadı.');
        return res.data;
      }),
      catchError(this.handleError('Audit logları alınamadı'))
    );
  }

  private handleError(defaultMessage: string) {
    return (error: any) => {
      const message = error?.error?.message || defaultMessage;
      return throwError(() => new Error(message));
    };
  }
}
