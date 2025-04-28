import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  roles: Role[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private roleService: RoleService, private router: Router) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.roleService.getRoles().subscribe({
      next: roles => {
        this.roles = roles;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message || 'Roller alınamadı';
        this.isLoading = false;
      }
    });
  }

  createRole(): void {
    this.router.navigate(['/dashboard/roles/create']);
  }

  editRole(role: Role): void {
    this.router.navigate(['/dashboard/roles/edit', role._id]);
  }

  deleteRole(role: Role): void {
    if (!confirm(`"${role.role_name}" rolünü silmek istiyor musunuz?`)) return;

    this.roleService.checkRoleUsage(role._id).subscribe({
      next: usage => {
        if (usage.length > 0) {
          alert('Bu rol bazı kullanıcılara atanmış. Önce o kullanıcıların rollerini değiştirin.');
          return;
        }

        this.roleService.deleteRole(role._id).subscribe({
          next: () => this.loadRoles(),
          error: err => alert('Silme hatası: ' + err.message)
        });
      },
      error: err => alert('Rol kullanım kontrolü hatası: ' + err.message)
    });
  }
}
