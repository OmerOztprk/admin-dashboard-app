import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/models/customer.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
      error: () => {
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

  deleteCustomer(customer: Customer): void {
    const confirmed = confirm(`${customer.name} adlı müşteriyi silmek istediğinize emin misiniz?`);
    if (!confirmed) return;

    this.customerService.deleteCustomer(customer._id).subscribe({
      next: () => {
        this.customers = this.customers.filter(c => c._id !== customer._id);
      },
      error: () => {
        alert('Silme işlemi sırasında hata oluştu.');
      }
    });
  }
}
