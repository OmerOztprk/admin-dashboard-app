import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Role } from '../models/role.model';
import { Privilege, PrivilegeGroup } from '../models/role-privilege.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly API_URL = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<ApiResponse<Role[]>>(this.API_URL).pipe(
      map(res => res.data || []),
      catchError(this.handleHttpError('Roller alınamadı'))
    );
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<ApiResponse<Role>>(`${this.API_URL}/${id}`).pipe(
      map(res => {
        if (!res.data) throw new Error('Rol bulunamadı.');
        return res.data;
      }),
      catchError(this.handleHttpError('Rol getirilemedi'))
    );
  }

  createRole(role: Partial<Role>): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/add`, role).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Rol oluşturulamadı'))
    );
  }

  updateRole(role: Partial<Role>): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/update`, role).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Rol güncellenemedi'))
    );
  }

  deleteRole(id: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/delete`, { _id: id }).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Rol silinemedi'))
    );
  }

  getAllPrivileges(): Observable<{ privGroups: PrivilegeGroup[], privileges: Privilege[] }> {
    return this.http.get<ApiResponse<{ privGroups: PrivilegeGroup[], privileges: Privilege[] }>>(
      `${this.API_URL}/role_privileges`
    ).pipe(
      map(res => res.data || { privGroups: [], privileges: [] }),
      catchError(this.handleHttpError('Yetkiler alınamadı'))
    );
  }

  checkRoleUsage(roleId: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/${roleId}/usage`).pipe(
      map(res => res.data || []),
      catchError(this.handleHttpError('Rol kullanım bilgisi alınamadı'))
    );
  }

  private handleHttpError(fallbackMessage: string) {
    return (error: any) => {
      const message = error?.error?.message || fallbackMessage;
      return throwError(() => new Error(message));
    };
  }
}
