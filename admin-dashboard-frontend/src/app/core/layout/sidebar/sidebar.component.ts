import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  @Input() isCollapsed = false;

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
      permission: 'manage_users',
      children: [
        {
          title: 'Kullanıcılar',
          link: '/dashboard/users',
          icon: 'bi-person'
        },
        {
          title: 'Roller',
          link: '/dashboard/roles',
          icon: 'bi-shield'
        }
      ]
    },
    {
      title: 'İçerik Yönetimi',
      icon: 'bi-folder',
      expanded: false,
      permission: 'manage_content',
      children: [
        {
          title: 'Kategoriler',
          link: '/dashboard/categories',
          icon: 'bi-grid'
        },
        {
          title: 'Ürünler',
          link: '/dashboard/products',
          icon: 'bi-box'
        }
      ]
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
  ) { }

  toggleSubMenu(item: MenuItem): void {
    if (this.isCollapsed) return;
    item.expanded = !item.expanded;
  }

  hasPermission(permission?: string): boolean {
    if (!permission) return true;
    return this.authService.hasPermission(permission);
  }
  // Add this new method to the SidebarComponent class

  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;

    return item.children.some(child =>
      child.link && this.router.isActive(child.link, {
        paths: 'exact',
        queryParams: 'exact',
        fragment: 'ignored',
        matrixParams: 'ignored'
      })
    );
  }
}
