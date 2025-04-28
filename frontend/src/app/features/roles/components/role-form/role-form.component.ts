import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoleService } from '../../../../core/services/role.service';
import { GroupedPrivilege } from '../../../../core/models/role-privilege.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  roleId: string | null = null;
  groupedPrivileges: GroupedPrivilege[] = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.roleId;

    this.initForm();
    this.loadPrivileges();

    if (this.isEditMode && this.roleId) {
      this.loadRole(this.roleId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      role_name: ['', Validators.required],
      is_active: [true],
      permissions: [[]]
    });
  }

  loadRole(id: string): void {
    this.roleService.getRoleById(id).subscribe({
      next: role => {
        this.form.patchValue(role);
      },
      error: err => {
        alert('Rol bilgisi alınamadı: ' + err.message);
        this.router.navigate(['/dashboard/roles']);
      }
    });
  }

  loadPrivileges(): void {
    this.roleService.getAllPrivileges().subscribe({
      next: ({ privGroups, privileges }) => {
        this.groupedPrivileges = privGroups.map(group => ({
          groupId: group.id,
          groupName: group.name,
          permissions: privileges
            .filter(p => p.group === group.id)
            .map(p => ({ key: p.key, name: p.name }))
        }));
      },
      error: err => {
        alert('Yetkiler alınamadı: ' + err.message);
      }
    });
  }

  togglePermission(permissionKey: string): void {
    const currentPermissions = this.form.get('permissions')?.value || [];
    const updatedPermissions = currentPermissions.includes(permissionKey)
      ? currentPermissions.filter((p: string) => p !== permissionKey)
      : [...currentPermissions, permissionKey];

    this.form.patchValue({ permissions: updatedPermissions });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const request$ = this.isEditMode && this.roleId
      ? this.roleService.updateRole({ _id: this.roleId, ...this.form.value })
      : this.roleService.createRole(this.form.value);

    request$.subscribe({
      next: () => this.router.navigate(['/dashboard/roles']),
      error: err => alert('Hata: ' + err.message)
    });
  }
}
