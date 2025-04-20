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
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoading = false;
      },
      error: (err) => {
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
    const confirmed = confirm(`"${role.role_name}" adlı rolü silmek istiyor musunuz?`);
    if (!confirmed) return;

    this.roleService.deleteRole(role._id).subscribe({
      next: () => {
        this.roles = this.roles.filter(r => r._id !== role._id);
      },
      error: (err) => {
        alert('Silme işlemi başarısız: ' + err.message);
      }
    });
  }
}
