import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User, UserListResponse, UserCreateRequest, UserUpdateRequest } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.API_URL}/users`)
      .pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
          return throwError(() => new Error('Kullanıcılar alınamadı'));
        })
      );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user:', error);
          return throwError(() => new Error('Kullanıcı bulunamadı'));
        })
      );
  }

  createUser(userData: UserCreateRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/add`, userData)
      .pipe(
        catchError(error => {
          console.error('Error creating user:', error);
          return throwError(() => error.error?.message || 'Kullanıcı oluşturulamadı');
        })
      );
  }

  updateUser(userData: UserUpdateRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/update`, userData)
      .pipe(
        catchError(error => {
          console.error('Error updating user:', error);
          return throwError(() => error.error?.message || 'Kullanıcı güncellenemedi');
        })
      );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/delete`, { _id: userId })
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          return throwError(() => error.error?.message || 'Kullanıcı silinemedi');
        })
      );
  }

  // Eksik olan metod eklendi
  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/profile`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return throwError(() => new Error('Kullanıcı profili alınamadı'));
        })
      );
  }
}