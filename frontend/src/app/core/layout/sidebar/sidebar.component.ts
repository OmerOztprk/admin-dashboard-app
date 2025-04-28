import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

interface MenuItem {
  title: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
  expanded?: boolean;
  permission?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  currentUser$: Observable<User | null>;
  loading$: Observable<boolean>;

  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'bi-speedometer2',
      link: '/dashboard'
    },
    {
      title: 'Kullanıcı Yönetimi',
      icon: 'bi-people',
      expanded: false,
      permission: 'user_view',
      children: [
        {
          title: 'Kullanıcılar',
          link: '/dashboard/users',
          icon: 'bi-person',
          permission: 'user_view'
        },
        {
          title: 'Roller',
          link: '/dashboard/roles',
          icon: 'bi-shield',
          permission: 'role_view'
        }
      ]
    },
    {
      title: 'İçerik Yönetimi',
      icon: 'bi-folder',
      expanded: false,
      permission: 'category_view',
      children: [
        {
          title: 'Kategoriler',
          link: '/dashboard/categories',
          icon: 'bi-grid',
          permission: 'category_view'
        },
        {
          title: 'Ürünler',
          link: '/dashboard/products',
          icon: 'bi-box',
          permission: 'product_view'
        }
      ]
    },
    {
      title: 'Audit Logları',
      icon: 'bi-journal-text',
      link: '/dashboard/auditlogs',
      permission: 'auditlogs_view'
    },
    {
      title: 'İstatistikler',
      icon: 'bi-bar-chart-line',
      link: '/dashboard/stats',
      permission: 'stats_view'
    },
    {
      title: 'Raporlar',
      icon: 'bi-graph-up',
      link: '/dashboard/reports'
    },
    {
      title: 'Ayarlar',
      icon: 'bi-gear',
      link: '/dashboard/settings'
    }
  ];

  constructor(
    private authService: AuthService,
    public router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.loading$ = this.authService.loading$;
  }

  toggleSubMenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  hasPermission(user: User | null, permission?: string): boolean {
    if (!permission) return true;
    if (!user) return false;
    return user.permissions?.includes(permission) ?? false;
  }
}
