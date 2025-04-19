import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'; // 🔥 Ekledik
import { AuthService } from '../../services/auth.service';
import { NamePipe } from '../../../shared/pipes/name.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatDividerModule, // ✅ Burada
    AsyncPipe,
    NamePipe
  ]
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
