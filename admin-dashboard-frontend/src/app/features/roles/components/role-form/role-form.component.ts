import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../../core/services/role.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Role } from '../../../../core/models/role.model';
import { GroupedPrivilege, PrivilegeGroup, Privilege } from '../../../../core/models/role-privilege.model';

@Component({
    selector: 'app-role-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
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
    ) { }

    ngOnInit(): void {
        this.roleId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.roleId;

        this.initForm();
        this.loadPrivileges();

        if (this.isEditMode && this.roleId) {
            this.roleService.getRoleById(this.roleId).subscribe({
                next: (res: ApiResponse<Role>) => {
                    if (res.data) this.form.patchValue(res.data);
                },
                error: (err) => alert('Rol bilgisi alınamadı: ' + err.message)
            });
        }
    }

    initForm(): void {
        this.form = this.fb.group({
            role_name: ['', Validators.required],
            is_active: [true],
            permissions: [[]]
        });
    }

    loadPrivileges(): void {
        this.roleService.getAllPrivileges().subscribe({
            next: (res: ApiResponse<any>) => {
                const { privGroups, privileges } = res.data;

                this.groupedPrivileges = privGroups.map((group: any) => ({
                    groupId: group.id,
                    groupName: group.name,
                    permissions: privileges
                        .filter((p: any) => p.group === group.id)
                        .map((p: any) => ({ key: p.key, name: p.name }))
                }));
            },
            error: (err) => {
                alert('Yetkiler alınamadı: ' + err.message);
            }
        });
    }


    togglePermission(permissionKey: string): void {
        const current = this.form.value.permissions || [];
        const updated = current.includes(permissionKey)
            ? current.filter((p: string) => p !== permissionKey)
            : [...current, permissionKey];

        this.form.patchValue({ permissions: updated });
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const data = this.form.value;
        const request$ = this.isEditMode && this.roleId
            ? this.roleService.updateRole({ _id: this.roleId, ...data })
            : this.roleService.createRole(data);

        request$.subscribe({
            next: () => this.router.navigate(['/dashboard/roles']),
            error: (err) => alert('Hata: ' + err.message)
        });
    }
}
