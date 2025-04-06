import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { CustomerListComponent } from '../../components/customer-list/customer-list.component';
import { RefreshAllBalancesResponse } from '../../interfaces/refresh-all-balances-response.interface';
import { PlaidService } from '../../services/plaid.service';

@Component({
  selector: 'app-customer-list-page',
  standalone: false,
  templateUrl: './customer-list-page.component.html',
  styleUrls: ['./customer-list-page.component.scss'],
})
export class CustomerListPageComponent implements AfterViewInit {
  @ViewChild(CustomerListComponent) customerListComponent!: CustomerListComponent;

  constructor(
    private readonly router: Router,
    private readonly plaidService: PlaidService,
    private readonly toastr: ToastrService,
    private readonly spinner: NgxSpinnerService,
  ) {
  }

  ngAfterViewInit(): void {
    // Do nothing!
  }

  createCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  updateAllBalances() {
    this.spinner.show();

    this.plaidService.refreshAllBalances().subscribe({
      next: (data: RefreshAllBalancesResponse) => {
        this.toastr.success(`Linked customers: ${data.linked}. Refreshed balance: ${data.refreshed}`, 'Success');

        this.refreshCustomerList();

        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
      },
    });
  }

  private refreshCustomerList() {
    if (this.customerListComponent) {
      this.customerListComponent.refreshList();
    }
  }
}
