export interface Customer {
  id: number;
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  street?: string;
  street2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country: string;
  linked: boolean;
  balance: number;
  updatedAt: Date;
  linkToken?: string | null;
}
