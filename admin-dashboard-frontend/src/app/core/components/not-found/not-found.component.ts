import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container text-center py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <h1 class="display-1 text-danger">404</h1>
              <h2 class="mb-4">Sayfa Bulunamadı</h2>
              <p class="lead mb-4">
                Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
              </p>
              <hr class="my-4">
              <p>Ana sayfaya dönmek için aşağıdaki butona tıklayabilirsiniz.</p>
              <a routerLink="/dashboard" class="btn btn-primary btn-lg">
                <i class="bi bi-house me-2"></i> Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .display-1 {
      font-size: 7rem;
      font-weight: 300;
    }
    .card {
      border-radius: 1rem;
    }
  `]
})
export class NotFoundComponent {}