import { Customer } from '../entities/customer.entity';

export interface BalanceData {
  customer: Customer,
  refreshed: boolean;
  message: string;
}
