import { Customer } from '../entities/customer.entity';

export interface RefreshAllBalancesResponse {
  linked: number;
  refreshed: number;
  customers: Customer[];
}
