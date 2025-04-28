import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(this.API_URL).pipe(
      map(res => res.data || []),
      catchError(this.handleHttpError('Kullanıcılar yüklenemedi'))
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/${id}`).pipe(
      map(res => {
        if (!res.data) throw new Error('Kullanıcı bulunamadı.');
        return res.data;
      }),
      catchError(this.handleHttpError('Kullanıcı getirilemedi'))
    );
  }

  createUser(data: Partial<User> & { password: string; roles: string[] }): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/add`, data).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Kullanıcı oluşturulamadı'))
    );
  }

  updateUser(id: string, data: Partial<User> & { password?: string; roles?: string[] }): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/update`, { _id: id, ...data }).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Kullanıcı güncellenemedi'))
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/delete`, { _id: id }).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Kullanıcı silinemedi'))
    );
  }

  private handleHttpError(fallbackMessage: string) {
    return (error: any) => {
      const message = error?.error?.message || fallbackMessage;
      return throwError(() => new Error(message));
    };
  }
}
