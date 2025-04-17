import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Role, Permission } from '../../../../core/models/role.model';

interface PermissionResponse {
  privGroups: any[];
  // Ek özellikleri API yanıtına göre buraya ekleyebilirsiniz
}

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
  roleForm: FormGroup;
  permissionGroups: any[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  isEditMode = false; 
  roleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      role_name: ['', [Validators.required, Validators.minLength(3)]],
      permissions: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPermissions();
    
    // Check if we're in edit mode by looking for an ID parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.roleId = id;
      this.loadRoleData(id);
    }
  }

  loadPermissions(): void {
    this.loading = true;
    this.roleService.getPermissions().subscribe({
      next: (response: PermissionResponse) => {
        this.permissionGroups = response.privGroups;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'İzinler yüklenirken bir hata oluştu';
        this.loading = false;
        console.error('Error loading permissions:', error);
      }
    });
  }

  loadRoleData(id: string): void {
    this.loading = true;
    this.roleService.getRoleById(id).subscribe({
      next: (role) => {
        this.roleForm.patchValue({
          role_name: role.role_name,
          permissions: role.permissions || []
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Rol bilgileri yüklenirken bir hata oluştu';
        this.loading = false;
        console.error('Error loading role:', error);
      }
    });
  }

  // Check if permission is selected
  isPermissionSelected(permissionKey: string): boolean {
    const permissions = this.roleForm.get('permissions')?.value as string[];
    return permissions.includes(permissionKey);
  }

  // Toggle permission selection
  togglePermission(permissionKey: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const permissions = [...this.roleForm.get('permissions')?.value as string[]];
    
    if (checkbox.checked) {
      if (!permissions.includes(permissionKey)) {
        permissions.push(permissionKey);
      }
    } else {
      const index = permissions.indexOf(permissionKey);
      if (index !== -1) {
        permissions.splice(index, 1);
      }
    }
    
    this.roleForm.get('permissions')?.setValue(permissions);
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      return;
    }

    this.submitting = true;
    
    if (this.isEditMode && this.roleId) {
      // Update existing role
      const updatedRole = {
        id: this.roleId,
        ...this.roleForm.value
      };
      
      this.roleService.updateRole(updatedRole).subscribe({
        next: () => {
          this.router.navigate(['/roles']);
        },
        error: (error) => {
          this.error = error.message || 'Rol güncellenirken bir hata oluştu';
          this.submitting = false;
        }
      });
    } else {
      // Create new role
      this.roleService.createRole(this.roleForm.value).subscribe({
        next: () => {
          this.router.navigate(['/roles']);
        },
        error: (error) => {
          this.error = error.message || 'Rol oluşturulurken bir hata oluştu';
          this.submitting = false;
        }
      });
    }
  }

  // Added missing cancel method
  cancel(): void {
    this.router.navigate(['/roles']);
  }
}