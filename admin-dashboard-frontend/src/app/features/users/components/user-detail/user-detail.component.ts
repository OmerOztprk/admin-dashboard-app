import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user?: User;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router, // Changed to public to use in template
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/dashboard/users']);
      return;
    }

    this.userService.getUserById(id).subscribe({
      next: res => {
        this.user = res.data;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message || 'Kullanıcı yüklenemedi.';
        this.isLoading = false;
      }
    });
  }

}