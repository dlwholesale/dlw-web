import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SupabaseService } from '../../../core/services/supabase.service';

import { Customer } from '../../entities/customer.entity';
import { BalanceData } from '../../interfaces/balance-data.interface';
import { CustomerService } from '../../services/customer.service';
import { PlaidService } from '../../services/plaid.service';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  private readonly mobileColumns: string[] = ['name', 'balance', 'actions'];
  private readonly desktopColumns: string[] = ['customerId', 'name', 'businessName', 'linked', 'balance', 'updatedAt', 'actions'];
  displayedColumns: string[] = this.desktopColumns;
  dataSource: MatTableDataSource<Customer> = new MatTableDataSource();
  isMobile = false;
  isAdmin: boolean = false;
  menuCustomer: Customer | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly customerService: CustomerService,
    private readonly plaidService: PlaidService,
    private readonly toastr: ToastrService,
    private readonly spinner: NgxSpinnerService,
    private readonly router: Router,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly supabaseService: SupabaseService,
  ) {
  }

  ngOnInit(): void {
    this.supabaseService.isAdmin().then(isAdmin => this.isAdmin = isAdmin);

    this.loadCustomers();

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(({ matches }) => {
        this.isMobile = matches;
        this.displayedColumns = matches ? this.mobileColumns : this.desktopColumns;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: Customer, property: string): string | number => {
      const value = (item as any)[property];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendPlaidLink(customer: Customer): void {
    this.spinner.show();

    this.customerService.createAndSendLinkToken(customer.id).subscribe({
      next: (customer: Customer) => {
        this.dataSource.data = this.dataSource.data.map(c =>
          c.id === customer.id ? customer : c,
        );

        this.toastr.success(`Email sent to ${customer.name} for account linking using Plaid-hosted frontend!`, 'Success');

        this.spinner.hide();
      },
      error: (err) => {
        this.toastr.error(`Could not send email to customer! ${err.error.message}`, 'Error');

        this.spinner.hide();
      },
    });
  }

  queryBalance(customer: Customer): void {
    this.spinner.show();

    this.plaidService.getBalance(customer.id).subscribe({
      next: (data: BalanceData) => {
        if (data.refreshed) {
          customer.balance = data.customer.balance;
          customer.updatedAt = data.customer.updatedAt;

          this.dataSource.data = this.dataSource.data.map(c =>
            c.id === customer.id ? customer : c,
          );

          this.toastr.success(`Balance updated successfully for customer ${customer.name}!`, 'Success');
        } else {
          this.toastr.info(`Balance for customer ${customer.name} is up to date (it was queried less than ten minutes ago)!`, 'Info');
        }

        this.spinner.hide();
      },
      error: (err) => {
        this.toastr.error(`Failed to fetch customer's balance! ${err.error.message}`, 'Error');

        this.spinner.hide();
      },
    });
  }

  confirmDelete(customer: Customer) {
    const confirmDeletion = confirm(`Are you sure you want to delete ${customer.name}?`);
    if (confirmDeletion) {
      this.deleteCustomer(customer);
    }
  }

  refreshList() {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.spinner.show();

    this.customerService.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        customers.forEach(c => c.updatedAt = new Date(c.updatedAt));

        this.dataSource.data = customers;

        this.spinner.hide();
      },
      error: (err) => {
        this.toastr.error(`Failed to fetch customers! ${err.error.message}`, 'Error');

        this.spinner.hide();
      },
    });
  }

  edit(customer: Customer): void {
    this.router.navigate(['/customers', customer.id]);
  }

  private deleteCustomer(customer: Customer) {
    this.spinner.show();

    this.customerService.deleteCustomer(customer.id).subscribe({
      next: () => {
        this.toastr.success(`Customer ${customer.name} deleted successfully!`, 'Success');

        this.spinner.hide();

        this.loadCustomers();
      },
      error: (err) => {
        this.toastr.error(`Failed to delete customer! ${err.error.message}`, 'Error');

        this.spinner.hide();
      },
    });
  }
}
