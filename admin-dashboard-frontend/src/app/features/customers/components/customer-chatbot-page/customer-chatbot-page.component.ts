import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/models/customer.model';

@Component({
  selector: 'app-customer-chatbot-page',
  templateUrl: './customer-chatbot-page.component.html',
  styleUrls: ['./customer-chatbot-page.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CustomerChatbotPageComponent implements OnInit {
  slug: string | null = null;
  customer: Customer | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');

    if (this.slug) {
      this.customerService.getCustomerBySlug(this.slug).subscribe({
        next: (res) => {
          this.customer = res.data ?? null;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Müşteri bulunamadı';
          this.loading = false;
        }
      });
    }
  }
}
