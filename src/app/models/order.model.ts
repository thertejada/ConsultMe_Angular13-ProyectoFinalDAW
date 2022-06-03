import { Company } from '.';

export interface Order {
  id?: number;
  code?: string;
  title?: string;
  description?: string;
  price?: number;
  date?: Date;
  status?: OrderStatus;
  company?: Company;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  READY_TO_PICK_UP = 'READY_TO_PICK_UP',
  DELIVERED = 'DELIVERED'
}
