import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly API_URL = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<ApiResponse<Customer[]>>(this.API_URL).pipe(
      map(res => res.data || []),
      catchError(this.handleHttpError('Müşteriler yüklenemedi'))
    );
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<ApiResponse<Customer>>(`${this.API_URL}/${id}`).pipe(
      map(res => {
        if (!res.data) throw new Error('Müşteri bulunamadı.');
        return res.data;
      }),
      catchError(this.handleHttpError('Müşteri getirilemedi'))
    );
  }

  getCustomerBySlug(slug: string): Observable<Customer> {
    return this.http.get<ApiResponse<Customer>>(`${this.API_URL}/slug/${slug}`).pipe(
      map(res => {
        if (!res.data) throw new Error('Müşteri bulunamadı.');
        return res.data;
      }),
      catchError(this.handleHttpError('Müşteri slug ile getirilemedi'))
    );
  }

  createCustomer(customer: Partial<Customer>): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/add`, customer).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Müşteri oluşturulamadı'))
    );
  }

  updateCustomer(customer: Partial<Customer>): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/update`, customer).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Müşteri güncellenemedi'))
    );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/delete`, { _id: id }).pipe(
      map(res => res.data),
      catchError(this.handleHttpError('Müşteri silinemedi'))
    );
  }

  private handleHttpError(fallbackMessage: string) {
    return (error: any) => {
      const message = error?.error?.message || fallbackMessage;
      return throwError(() => new Error(message));
    };
  }
}
