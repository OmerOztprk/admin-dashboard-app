import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Role, RoleCreateRequest, RoleUpdateRequest } from '../../../core/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Original getRoles method
  getRoles(): Observable<any> {
    return this.http.get(`${this.API_URL}/roles`)
      .pipe(
        catchError(error => {
          console.error('Error fetching roles:', error);
          return throwError(() => new Error('Roller alınamadı'));
        })
      );
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/roles/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching role:', error);
          return throwError(() => new Error('Rol bulunamadı'));
        })
      );
  }

  createRole(roleData: RoleCreateRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/roles/add`, roleData)
      .pipe(
        catchError(error => {
          console.error('Error creating role:', error);
          return throwError(() => error.error?.message || 'Rol oluşturulamadı');
        })
      );
  }

  updateRole(roleData: RoleUpdateRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/roles/update`, roleData)
      .pipe(
        catchError(error => {
          console.error('Error updating role:', error);
          return throwError(() => error.error?.message || 'Rol güncellenemedi');
        })
      );
  }

  deleteRole(roleId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/roles/delete`, { _id: roleId })
      .pipe(
        catchError(error => {
          console.error('Error deleting role:', error);
          return throwError(() => error.error?.message || 'Rol silinemedi');
        })
      );
  }

  getPermissions(): Observable<any> {
    return this.http.get(`${this.API_URL}/roles/role_privileges`)
      .pipe(
        catchError(error => {
          console.error('Error fetching permissions:', error);
          return throwError(() => new Error('İzinler alınamadı'));
        })
      );
  }
}