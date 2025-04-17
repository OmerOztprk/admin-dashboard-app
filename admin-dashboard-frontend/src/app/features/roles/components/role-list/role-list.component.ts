import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Role } from '../../../../core/models/role.model';
import { SystemPermissions } from '../../../../core/models/role.model';
import { AuthService } from '../../../auth/services/auth.service';

interface RoleResponse {
  data: Role[];
  // API yanıt yapısına göre diğer özellikler eklenebilir
}

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  loading = false;
  error: string | null = null;
  SystemPermissions = SystemPermissions;
  
  // Arama ve sayfalama için
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pageNumbers: number[] = [];

  constructor(
    private roleService: RoleService, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.error = null;

    this.roleService.getRoles()
      .subscribe({
        next: (response: RoleResponse) => {
          this.roles = response.data;
          this.filteredRoles = [...this.roles];
          this.updatePagination();
          this.loading = false;
        },
        error: (err: Error) => {
          this.error = 'Roller yüklenirken bir hata oluştu.';
          this.loading = false;
          console.error('Error loading roles', err);
        }
      });
  }

  hasPermission(permission: SystemPermissions): boolean {
    return this.authService.hasPermission(permission);
  }

  // Eksik olan metodu ekliyorum - template'ten çağrılan getPermissionValues metodu
  getPermissionValues(permissions: any[] | null | undefined): string[] {
    if (!permissions || permissions.length === 0) {
      return [];
    }
    
    return permissions.map(permission => {
      if (typeof permission === 'string') {
        return permission;
      } else if (permission && typeof permission === 'object') {
        if ('key' in permission) {
          return permission.key;
        } else if ('name' in permission) {
          return permission.name;
        }
      }
      return String(permission);
    });
  }

  deleteRole(role: Role): void {
    if (confirm(`${role.role_name} rolünü silmek istediğinizden emin misiniz?`)) {
      this.roleService.deleteRole(role.id)
        .subscribe({
          next: () => {
            this.roles = this.roles.filter(r => r.id !== role.id);
            this.applyFilter();
          },
          error: (err: Error) => {
            console.error('Error deleting role', err);
            alert('Rol silinirken bir hata oluştu.');
          }
        });
    }
  }

  // Arama terimine göre rolleri filtreler
  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredRoles = [...this.roles];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredRoles = this.roles.filter(role => 
        role.role_name.toLowerCase().includes(searchTermLower)
      );
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }

  // Sayfalama bilgilerini günceller
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRoles.length / this.pageSize);
    this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  // Sayfa değiştirme
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }
}