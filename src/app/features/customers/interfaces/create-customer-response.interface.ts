import { Customer } from '../entities/customer.entity';

export interface CreateCustomerResponse {
  customer: Customer;
  message: string;
}
