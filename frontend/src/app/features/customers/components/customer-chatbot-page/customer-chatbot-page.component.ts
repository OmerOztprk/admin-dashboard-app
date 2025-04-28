import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/models/customer.model';
import { CustomerChatbotWidgetComponent } from '../customer-chatbot-widget/customer-chatbot-widget.component';

@Component({
  selector: 'app-customer-chatbot-page',
  standalone: true,
  imports: [CommonModule, CustomerChatbotWidgetComponent],
  templateUrl: './customer-chatbot-page.component.html',
  styleUrls: ['./customer-chatbot-page.component.scss']
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
        next: (customer) => {
          this.customer = customer ?? null;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Müşteri bulunamadı';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Geçersiz bağlantı';
      this.loading = false;
    }
  }
}
