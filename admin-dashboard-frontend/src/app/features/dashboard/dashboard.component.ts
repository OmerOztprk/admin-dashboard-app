import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { Subject, takeUntil, firstValueFrom, forkJoin } from 'rxjs';
import { SystemPermissions } from '../../core/models/role.model';

// API URL sabitini tanımla
const API_URL = 'http://localhost:5000/api';

interface DashboardStats {
  userCount: number;
  categoryCount: number;
  auditLogCount: number;
  recentActivities: any[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    userCount: 0,
    categoryCount: 0,
    auditLogCount: 0,
    recentActivities: []
  };
  
  loading = false;
  SystemPermissions = SystemPermissions;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentActivities();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserName(): string {
    return this.authService.getUserFullName() || 'Kullanıcı';
  }
  
  hasPermission(permission: SystemPermissions): boolean {
    return this.authService.hasPermission(permission);
  }
  
  loadStats(): void {
    this.loading = true;
    
    // Tüm istek sonuçlarını takip etmek için
    const userCount$ = this.http.get<any>(`${API_URL}/stats/users/count`);
    const categoryCount$ = this.http.get<any>(`${API_URL}/stats/categories/count`);
    const auditLogCount$ = this.http.get<any>(`${API_URL}/stats/auditlogs/count`);
    
    // ForkJoin ile tüm istekleri paralel olarak çalıştır ve hepsi tamamlandığında loading durumunu güncelle
    forkJoin({
      users: userCount$,
      categories: categoryCount$,
      auditLogs: auditLogCount$
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (results) => {
        this.stats.userCount = results.users.count || 0;
        this.stats.categoryCount = results.categories.count || 0;
        this.stats.auditLogCount = results.auditLogs.count || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('İstatistikler alınırken hata oluştu', err);
        this.loading = false;
      }
    });
  }
  
  loadRecentActivities(): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${API_URL}/auditlogs/recent`)
        .pipe(takeUntil(this.destroy$))
    )
    .then(res => {
      this.stats.recentActivities = res.logs || [];
      return res;
    })
    .catch(err => {
      console.error('Son aktiviteler alınamadı', err);
      throw err;
    });
  }
  
  refreshActivities(): void {
    this.loading = true;
    this.loadRecentActivities()
      .finally(() => {
        this.loading = false;
      });
  }
  
  logout(event?: Event): void {
    if (event) event.preventDefault();
    this.authService.logout();
  }
}