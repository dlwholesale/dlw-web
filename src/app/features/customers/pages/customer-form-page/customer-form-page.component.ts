import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-form-page',
  standalone: false,
  templateUrl: './customer-form-page.component.html',
  styleUrl: './customer-form-page.component.scss',
})
export class CustomerFormPageComponent implements OnInit {
  customerId: number | null = null;
  isEditMode: boolean = false;

  constructor(private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.customerId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.isEditMode = !!this.route.snapshot.paramMap.get('id');
  }

  getTitle(): string {
    return this.isEditMode ? 'Edit Customer' : 'Register Customer';
  }
}
