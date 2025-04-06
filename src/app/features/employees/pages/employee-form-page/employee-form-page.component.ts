import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-form-page',
  standalone: false,
  templateUrl: './employee-form-page.component.html',
  styleUrls: ['./employee-form-page.component.scss']
})
export class EmployeeFormPageComponent implements OnInit {
  employeeId: string | null = null;
  isEditMode: boolean = false;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') ?? null;
    this.isEditMode = !!this.route.snapshot.paramMap.get('id');
  }

  getTitle(): string {
    return this.isEditMode ? 'Edit Employee' : 'Register Employee';
  }
}
