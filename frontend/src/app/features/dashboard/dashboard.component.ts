import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuditLogsService } from '../../core/services/audit-logs.service';
import { User } from '../../core/models/user.model';
import { AuditLog } from '../../core/models/audit-log.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  summaryData = { userCount: 0, categoryCount: 0, productCount: 0, orderCount: 0 };
  statCards = [
    { title: 'Kullanıcılar', value: 0, icon: 'bi-people', color: '#4e73df', link: '/dashboard/users' },
    { title: 'Roller', value: 0, icon: 'bi-grid', color: '#1cc88a', link: '/dashboard/roles' },
    { title: 'Kategoriler', value: 0, icon: 'bi-box', color: '#36b9cc', link: '/dashboard/categories' },
    { title: 'Müşteriler', value: 0, icon: 'bi-cart', color: '#f6c23e', link: '/dashboard/customers' }
  ];

  recentActivities: AuditLog[] = [];
  expandedLogIds: Set<string> = new Set(); // ➡️ Açık olan detaylar

  constructor(
    private authService: AuthService,
    private auditLogsService: AuditLogsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadDashboardData();
    this.loadRecentActivities();
  }

  loadDashboardData(): void {
    setTimeout(() => {
      this.summaryData = {
        userCount: 15,
        categoryCount: 8,
        productCount: 120,
        orderCount: 45
      };
      this.updateStatCards();
    }, 1000);
  }

  loadRecentActivities(): void {
    this.auditLogsService.fetchLogs({ limit: 5 }).subscribe({
      next: (logs) => {
        this.recentActivities = logs;
      },
      error: (err) => {
        console.error('Aktiviteler alınamadı:', err.message);
      }
    });
  }

  updateStatCards(): void {
    this.statCards[0].value = this.summaryData.userCount;
    this.statCards[1].value = this.summaryData.categoryCount;
    this.statCards[2].value = this.summaryData.productCount;
    this.statCards[3].value = this.summaryData.orderCount;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  get fullName(): string {
    if (!this.currentUser) return 'Kullanıcı';
    const { first_name, last_name, email } = this.currentUser;
    return first_name && last_name ? `${first_name} ${last_name}` : (email ?? 'Kullanıcı');
  }

  toggleExpand(logId: string): void {
    if (this.expandedLogIds.has(logId)) {
      this.expandedLogIds.delete(logId);
    } else {
      this.expandedLogIds.add(logId);
    }
  }

  getIcon(procType: string): string {
    const type = procType.toLowerCase();
    if (type.includes('add')) return 'bi-plus-circle';
    if (type.includes('update')) return 'bi-pencil-square';
    if (type.includes('delete')) return 'bi-trash';
    if (type.includes('view')) return 'bi-eye';
    return 'bi-info-circle';
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'INFO': return 'text-success';
      case 'WARN': return 'text-warning';
      case 'ERROR': return 'text-danger';
      case 'DEBUG': return 'text-primary';
      default: return 'text-secondary';
    }
  }
}
