import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list-page',
  standalone: false,
  templateUrl: './employee-list-page.component.html',
  styleUrl: './employee-list-page.component.scss'
})
export class EmployeeListPageComponent {
  constructor(private readonly router: Router) {}

  addEmployee(): void {
    this.router.navigate(['/employees/new']);
  }
}
