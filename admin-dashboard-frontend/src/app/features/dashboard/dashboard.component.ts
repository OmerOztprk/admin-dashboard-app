import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  summaryData = {
    userCount: 0,
    categoryCount: 0,
    productCount: 0,
    orderCount: 0
  };

  recentActivities = [
    { id: 1, type: 'user', action: 'Yeni kullanıcı kaydı', user: 'Ahmet Yılmaz', date: new Date() },
    { id: 2, type: 'product', action: 'Ürün eklendi', user: 'Mehmet Demir', date: new Date(Date.now() - 86400000) },
    { id: 3, type: 'order', action: 'Sipariş tamamlandı', user: 'Ayşe Kaya', date: new Date(Date.now() - 172800000) }
  ];

  statCards = [
    { title: 'Kullanıcılar', value: 0, icon: 'bi-people', color: '#4e73df', link: '/dashboard/users' },
    { title: 'Roller', value: 0, icon: 'bi-grid', color: '#1cc88a', link: '/dashboard/categories' },
    { title: 'Kategoriler', value: 0, icon: 'bi-box', color: '#36b9cc', link: '/dashboard/products' },
    { title: 'Müşteriler', value: 0, icon: 'bi-cart', color: '#f6c23e', link: '/dashboard/orders' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    setTimeout(() => {
      this.summaryData = {
        userCount: 15,
        categoryCount: 8,
        productCount: 120,
        orderCount: 45
      };

      this.statCards[0].value = this.summaryData.userCount;
      this.statCards[1].value = this.summaryData.categoryCount;
      this.statCards[2].value = this.summaryData.productCount;
      this.statCards[3].value = this.summaryData.orderCount;
    }, 1000);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
