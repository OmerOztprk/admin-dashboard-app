import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/models/customer.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Müşteriler alınırken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  goToForm(): void {
    this.router.navigate(['/dashboard/customers/create']);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/dashboard/customers/edit', customer._id]);
  }

  goToChatbot(slug: string): void {
    this.router.navigate(['/', slug]);
  }
}
