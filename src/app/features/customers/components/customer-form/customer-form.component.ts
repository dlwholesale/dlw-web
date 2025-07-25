import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { phoneNumberValidator } from '../../../../shared/validators/phone.validator';
import { Customer } from '../../entities/customer.entity';
import { AchInfo } from '../../interfaces/ach-info.interface';
import { CreateCustomerResponse } from '../../interfaces/create-customer-response.interface';
import { CustomerService } from '../../services/customer.service';
import { PlaidService } from '../../services/plaid.service';

@Component({
  selector: 'app-customer-form',
  standalone: false,
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  @Input() customerId?: number | null = null;
  isEditMode: boolean = false;
  isLinked: boolean = false;
  hints = {
    name: '',
    email: '',
    phone: '',
    street: '',
    street2: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
  };
  achNumbers: AchInfo[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly customerService: CustomerService,
    private readonly plaidService: PlaidService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      customerId: ['', Validators.required],
      name: [''],
      businessName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [phoneNumberValidator()]],
      street: [''],
      street2: [''],
      city: [''],
      region: [''],
      postalCode: [''],
      country: ['', Validators.required],
    });

    if (this.customerId) {
      this.isEditMode = true;
      this.loadCustomer(this.customerId);
    }
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const updateData: Customer = this.customerForm.value;
    this.spinner.show();

    if (this.isEditMode && this.customerId) {
      this.customerService.updateCustomer(this.customerId, updateData).subscribe({
        next: (response: CreateCustomerResponse) => {
          this.toastr.success(`${response.message}`, 'Success');

          this.spinner.hide();

          setTimeout(() => this.router.navigate(['/customers']), 1500);
        },
        error: ({ err }) => {
          this.toastr.error(`Failed to update customer! ${err.error.message}`, 'Error');

          this.spinner.hide();
        },
      });
    } else {
      this.customerService.createCustomer(updateData).subscribe({
        next: (response: CreateCustomerResponse) => {
          this.toastr.success(`${response.message}`, 'Success');

          this.spinner.hide();

          setTimeout(() => this.router.navigate(['/customers']), 1500);
        },
        error: (err) => {
          this.toastr.error(`Failed to create customer! ${err.error.message}`, 'Error');

          this.spinner.hide();
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }

  private loadCustomer(id: number): void {
    this.spinner.show();

    this.customerService.getCustomer(id).subscribe({
      next: (customer: Customer) => {
        this.customerForm.patchValue({
          customerId: customer.customerId,
          name: customer.name,
          businessName: customer.businessName,
          email: customer.email,
          phone: customer.phone,
          street: customer.street,
          street2: customer.street2,
          city: customer.city,
          region: customer.region,
          postalCode: customer.postalCode,
          country: customer.country,
        });

        if (customer.linked) {
          this.isLinked = true;
          this.plaidService.getIdentity(id).subscribe(identity => {
            this.hints = {
              name: identity.name,
              email: identity.email,
              phone: identity.phone,
              street: identity.street,
              street2: '',
              city: identity.city,
              region: identity.region,
              postalCode: identity.postalCode,
              country: identity.country,
            };
          });

          this.plaidService.getAuth(id).subscribe({
            next: (auth) => {
              if (Array.isArray(auth)) {
                this.achNumbers = auth;
              } else {
                this.toastr.error('Failed to load bank info', 'Error');
              }
            },
            error: (err) => {
              this.toastr.error(`Failed to load bank info: ${err.message}`, 'Error');
            }
          });
        }

        this.spinner.hide();
      },
      error: (err) => {
        this.toastr.error(`Failed to load customer data! ${err.error.message}`, 'Error');

        this.spinner.hide();
      },
    });
  }
}
