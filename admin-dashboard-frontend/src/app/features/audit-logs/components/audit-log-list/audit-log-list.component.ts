import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  entity: string;
  entity_id: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

interface AuditLogResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './audit-log-list.component.html',
  styleUrls: ['./audit-log-list.component.scss']
})
export class AuditLogListComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = false;
  totalLogs = 0;
  currentPage = 1;
  pageSize = 10;
  filterForm: FormGroup;
  
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      user_email: [''],
      action: [''],
      entity: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    
    const params = {
      page: page.toString(),
      limit: this.pageSize.toString(),
      ...this.filterForm.value
    };
    
    // Boş parametreleri temizle
    Object.keys(params).forEach(key => {
      if (!params[key]) {
        delete params[key];
      }
    });
    
    this.http.get<AuditLogResponse>(`${this.API_URL}/audit-logs`, { params })
      .subscribe({
        next: (response) => {
          this.logs = response.logs;
          this.totalLogs = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Aktivite günlüğü yüklenirken hata oluştu', error);
          this.loading = false;
        }
      });
  }

  applyFilter() {
    this.loadLogs(1); // Filtreleme yapıldığında ilk sayfaya dön
  }

  resetFilter() {
    this.filterForm.reset();
    this.loadLogs(1);
  }

  getActionClass(action: string): string {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-success';
      case 'update':
        return 'bg-warning';
      case 'delete':
        return 'bg-danger';
      case 'login':
        return 'bg-info';
      case 'logout':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  }

  onPageChange(page: number) {
    this.loadLogs(page);
  }

  get totalPages(): number {
    return Math.ceil(this.totalLogs / this.pageSize);
  }

  get pages(): number[] {
    const pageCount = this.totalPages;
    const currentPage = this.currentPage;
    const maxPages = 5; // Gösterilecek maksimum sayfa sayısı
    
    if (pageCount <= maxPages) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = startPage + maxPages - 1;
    
    if (endPage > pageCount) {
      endPage = pageCount;
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}