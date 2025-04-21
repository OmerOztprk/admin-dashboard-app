import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/models/customer.model';

@Component({
    selector: 'app-customer-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
    form!: FormGroup;
    isEditMode = false;
    customerId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private customerService: CustomerService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.customerId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.customerId;

        this.form = this.fb.group({
            name: ['', Validators.required],
            slug: ['', Validators.required],
            email: [''],
            phone: [''],
            is_active: [true]
        });

        if (this.isEditMode && this.customerId) {
            this.customerService.getCustomerById(this.customerId).subscribe({
                next: res => {
                    if (res.data) {
                        this.form.patchValue(res.data);
                    } else {
                        alert('Müşteri verisi bulunamadı.');
                    }
                },
                error: () => alert('Müşteri bilgisi alınamadı.')
            });
        }

    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const data = this.form.value;

        const request$ = this.isEditMode
            ? this.customerService.updateCustomer({ _id: this.customerId, ...data })
            : this.customerService.createCustomer(data);

        request$.subscribe({
            next: () => this.router.navigate(['/dashboard/customers']),
            error: err => alert('Hata: ' + err.message)
        });
    }
}
