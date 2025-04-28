import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { NamePipe } from '../../../../shared/pipes/name.pipe';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, NamePipe],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Kullanıcılar yüklenemedi';
        this.isLoading = false;
      }
    });
  }

  viewUser(user: User): void {
    this.router.navigate(['/dashboard/users/detail', user._id]);
  }

  createUser(): void {
    this.router.navigate(['/dashboard/users/create']);
  }

  editUser(user: User): void {
    this.router.navigate(['/dashboard/users/edit', user._id]);
  }

  deleteUser(user: User): void {
    const confirmed = confirm(`Kullanıcıyı silmek istediğinize emin misiniz?\n${user.first_name || user.email}`);
    if (!confirmed) return;

    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== user._id);
      },
      error: (err) => {
        alert('Silme işlemi başarısız: ' + err.message);
      }
    });
  }

  // ✅ Template içinden erişilebilir hale getirildi
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
