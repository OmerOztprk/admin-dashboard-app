import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API_URL = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.API_URL).pipe(
      map(res => res.data || []),
      catchError(this.handleHttpError('Kategoriler yüklenemedi'))
    );
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.API_URL}/${id}`).pipe(
      map(res => {
        if (!res.data) throw new Error('Kategori bulunamadı.');
        return res.data;
      }),
      catchError(this.handleHttpError('Kategori getirilemedi'))
    );
  }

  createCategory(data: Partial<Category>): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/add`, data).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Kategori oluşturulamadı'))
    );
  }

  updateCategory(data: Partial<Category>): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/update`, data).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Kategori güncellenemedi'))
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/delete`, { _id: id }).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Kategori silinemedi'))
    );
  }

  private handleHttpError(fallbackMessage: string) {
    return (error: any) => {
      const message = error?.error?.message || fallbackMessage;
      return throwError(() => new Error(message));
    };
  }
}
