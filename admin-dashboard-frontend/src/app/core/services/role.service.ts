import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../models/role.model';
import { ApiResponse } from '../models/api-response.model';
import { Privilege, PrivilegeGroup } from '../models/role-privilege.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  // ROLLER

  getRoles(): Observable<Role[]> {
    return this.http.get<ApiResponse<Role[]>>(`${this.API_URL}`).pipe(
      map(res => res.data || [])
    );
  }

  getRoleById(id: string): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.API_URL}/${id}`);
  }

  createRole(role: Partial<Role>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/add`, role);
  }

  updateRole(role: Partial<Role>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/update`, role);
  }

  deleteRole(id: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/delete`, { _id: id });
  }

  // YETKİLER

  getAllPrivileges(): Observable<ApiResponse<{ privGroups: PrivilegeGroup[], privileges: Privilege[] }>> {
    return this.http.get<ApiResponse<{ privGroups: PrivilegeGroup[], privileges: Privilege[] }>>(
      `${this.API_URL}/role_privileges`
    );
  }
  checkRoleUsage(roleId: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/${roleId}/usage`).pipe(
      map(res => res.data || [])
    );
  }
  
}
