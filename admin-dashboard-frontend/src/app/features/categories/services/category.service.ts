import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Tüm kategorileri getir
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  // Kategori detayını getir
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/categories/${id}`);
  }

  // Yeni kategori ekle
  createCategory(categoryData: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/categories`, categoryData);
  }

  // Kategori güncelle
  updateCategory(categoryData: Category): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/categories/${categoryData._id}`, categoryData);
  }

  // Kategori sil
  deleteCategory(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.API_URL}/categories/${id}`);
  }
}