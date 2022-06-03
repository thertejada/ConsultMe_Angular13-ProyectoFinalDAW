import { Company, Order } from '.';

export interface User {
  id?: number;
  name?: string;
  surnames?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  company?: Company;
  orders?: Array<Order>;
}

export enum UserRole {
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  USER = 'USER'
}
