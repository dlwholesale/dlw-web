import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerResponse } from '../interfaces/create-customer-response.interface';
import { IdentityData } from '../interfaces/identity-data.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = `${environment.apiUrl}/customers`;

  constructor(private readonly http: HttpClient) {
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<CreateCustomerResponse> {
    return this.http.post<CreateCustomerResponse>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<CreateCustomerResponse> {
    return this.http.put<CreateCustomerResponse>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number) {
    return this.http.delete<Customer>(`${this.apiUrl}/${id}`);
  }

  createAndSendLinkToken(id: number) {
    return this.http.get<Customer>(`${this.apiUrl}/${id}/link/token/create-and-send`);
  }

  getIdentity(id: number): Observable<IdentityData> {
    return this.http.get<IdentityData>(`${this.apiUrl}/${id}/identity`);
  }
}
