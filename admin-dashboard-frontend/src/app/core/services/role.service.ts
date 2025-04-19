import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

interface Role {
  _id: string;
  role_name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<ApiResponse<Role[]>>(this.API_URL).pipe(
      map(response => {
        if (response.code === 200 && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }
}