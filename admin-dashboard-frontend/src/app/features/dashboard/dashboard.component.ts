import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
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
    // Kullanıcı sayısı
    this.http.get<any>(`${API_URL}/stats/users/count`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.stats.userCount = res.count || 0,
        error: err => console.error('Kullanıcı sayısı alınamadı', err)
      });
    
    // Kategori sayısı
    this.http.get<any>(`${API_URL}/stats/categories/count`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.stats.categoryCount = res.count || 0,
        error: err => console.error('Kategori sayısı alınamadı', err)
      });
    
    // Aktivite günlüğü sayısı
    this.http.get<any>(`${API_URL}/stats/auditlogs/count`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.stats.auditLogCount = res.count || 0,
        error: err => console.error('Aktivite günlüğü sayısı alınamadı', err)
      });
  }
  
  loadRecentActivities(): void {
    this.http.get<any>(`${API_URL}/auditlogs/recent`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.stats.recentActivities = res.logs || [],
        error: err => console.error('Son aktiviteler alınamadı', err)
      });
  }
  
  refreshActivities(): void {
    this.loadRecentActivities();
  }
  
  logout(event?: Event): void {
    if (event) event.preventDefault();
    this.authService.logout();
  }
}