import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Admin Dashboard';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Uygulama başladığında oturum durumunu kontrol et
    if (this.authService.isAuthenticated()) {
      // Kullanıcı zaten giriş yapmış, dashboard'a yönlendir
      this.router.navigate(['/dashboard']);
    } else {
      // Kullanıcı giriş yapmamış, login sayfasında kalacak
      console.log('Oturum açılmamış, giriş sayfası görüntüleniyor');
    }
  }
}