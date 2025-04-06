import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Employee } from '../../entities/employee.entity';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  confirmDelete(employee: Employee): void {
    const confirmDeletion = confirm(`Are you sure you want to delete ${employee.user_metadata?.['name']}?`);
    if (confirmDeletion) {
      this.deleteEmployee(employee);
    }
  }

  private loadEmployees() {
    this.spinner.show();

    this.employeeService.getEmployees().subscribe((employees) => {
      this.dataSource.data = employees;
      // this.dataSource.paginator = this.paginator;

      this.spinner.hide();
    });
  }

  private deleteEmployee(employee: Employee): void {
    this.spinner.show();

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.toastr.success(`Employee ${employee.user_metadata.name} deleted successfully!`, 'Success');

        this.spinner.hide();

        this.loadEmployees();
      },
      error: (err) => {
        this.toastr.error(`Failed to delete employee! ${err}`, 'Error');

        this.spinner.hide();
      },
    });
  }
}
