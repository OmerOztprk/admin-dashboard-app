import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../../../core/models/user.model';
import { SystemPermissions } from '../../../../core/models/role.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
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
    private userService: UserService, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers()
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.filteredUsers = [...this.users];
          this.updatePagination();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Kullanıcılar yüklenirken bir hata oluştu.';
          this.loading = false;
          console.error('Error loading users', err);
        }
      });
  }

  hasPermission(permission: SystemPermissions): boolean {
    return this.authService.hasPermission(permission);
  }

  // deleteUser metodunu User yerine id alsın diye düzeltiyorum
  deleteUser(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`${user.email} kullanıcısını silmek istediğinizden emin misiniz?`)) {
      this.userService.deleteUser(userId)
        .subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== userId);
            this.applyFilter(); // Filtrelenmiş listeyi güncelle
          },
          error: (err) => {
            console.error('Error deleting user', err);
            alert('Kullanıcı silinirken bir hata oluştu.');
          }
        });
    }
  }

  // Eksik metod ekleniyor - getUserRoleNames
  getUserRoleNames(user: User): string {
    if (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
      return '-';
    }
    
    return this.getRoleValues(user.roles).join(', ');
  }

  /**
   * Farklı türlerdeki rol değerlerini string dizisine dönüştürür.
   * Bu metod, template'te user.roles için tür güvenliği sağlar.
   */
  getRoleValues(roles: any[] | null | undefined): string[] {
    if (!roles || roles.length === 0) {
      return [];
    }
    
    return roles.map(role => {
      if (typeof role === 'string') {
        return role;
      } else if (role && typeof role === 'object') {
        // Object olabilecek farklı role yapılarını kontrol et
        if ('role_name' in role) {
          return role.role_name;
        } else if ('name' in role) {
          return role.name;
        }
      }
      // Bilinmeyen tür için string temsilini döndür
      return String(role);
    });
  }

  /**
   * Kullanıcı durum değerini okunabilir metne dönüştürür
   */
  getUserStatusText(isActive?: boolean): string {
    if (isActive === undefined) return 'Belirsiz';
    return isActive ? 'Aktif' : 'Pasif';
  }

  // Eksik metod ekleniyor - `getStatusText` metodu
  getStatusText(isActive?: boolean): string {
    return this.getUserStatusText(isActive);
  }

  // Eksik metod ekleniyor - `getStatusBadgeClass`
  getStatusBadgeClass(isActive?: boolean): string {
    if (isActive === undefined) return 'badge bg-secondary';
    return isActive ? 'badge bg-success' : 'badge bg-danger';
  }

  /**
   * Arama terimini kullanarak kullanıcıları filtreler
   */
  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user => 
        (user.first_name?.toLowerCase() || '').includes(searchTermLower) || 
        (user.last_name?.toLowerCase() || '').includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower)
      );
    }
    
    this.currentPage = 1; // Filtrelemeden sonra ilk sayfaya dön
    this.updatePagination();
  }

  /**
   * Sayfalama bilgilerini günceller
   */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  /**
   * Sayfa değiştirme
   */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  /**
   * Kullanıcıları dışa aktarma
   */
  exportUsers(format: 'excel' | 'pdf'): void {
    console.log(`Kullanıcılar ${format} formatında dışa aktarılıyor...`);
    // Gerçek uygulamada ilgili servisi çağırarak dışa aktarma işlemi yapılacak
  }
}