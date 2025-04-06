import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { Employee } from '../../entities/employee.entity';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: false,
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  @Input() employeeId: string | null = null;
  isEditMode = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(this.employeeId);
    }

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required, Validators.pattern('^(admin|employee)$')]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]],
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const formValue = this.employeeForm.value;
    this.spinner.show();

    if (this.isEditMode && this.employeeId) {
      // Build update payload; only include password if provided
      const updateData: any = {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
      };
      if (formValue.password) {
        updateData.password = formValue.password;
      }

      this.employeeService.updateEmployee(this.employeeId, updateData).subscribe({
        next: (employee: Employee) => {
          this.toastr.success(`Employee ${employee.user_metadata.name} updated successfully!`, 'Success');

          this.spinner.hide();

          setTimeout(() => this.router.navigate(['/employees']), 1500);
        },
        error: (err) => {
          this.toastr.error(`Failed to update employee! ${err}`, 'Error');

          this.spinner.hide();
        },
      });
    } else {
      this.employeeService.createEmployee(formValue).subscribe({
        next: (employee: Employee) => {
          this.toastr.success(`Employee ${employee.user_metadata.name} created successfully!`, 'Success');

          this.spinner.hide();

          setTimeout(() => this.router.navigate(['/employees']), 1500);
        },
        error: (err) => {
          this.toastr.error(`Failed to create employee! ${err}`, 'Error');

          this.spinner.hide();
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }

  private loadEmployee(id: string): void {
    this.spinner.show();

    this.employeeService.getEmployee(id).subscribe({
      next: (employee: Employee) => {
        this.employeeForm.patchValue({
          name: employee.user_metadata.name,
          role: employee.user_metadata.role ?? 'admin',
          email: employee.email,
          // Do not patch password fields on load
        });

        this.spinner.hide();
      },
      error: (err) => {
        this.toastr.error(`Failed to load employee! ${err}`, 'Error');

        this.spinner.hide();
      },
    });
  }
}
