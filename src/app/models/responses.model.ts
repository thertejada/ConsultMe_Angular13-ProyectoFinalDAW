import { Order, User } from '.';

export interface HttpError {
  code: number;
  message: string;
  description?: string;
  details?: Array<HttpError>;
}

export interface ResponsePostUsersLogin {
  data: { user: User; token: string };
  error?: HttpError;
}

export interface ResponsePostUsersRegister {
  data: { user: User; token: string };
  error?: HttpError;
}

export interface ResponseGetUsersSelf {
  data: User;
  error?: HttpError;
}

export interface ResponseGetOrders {
  data: {
    orders: Array<Order>;
    total: number;
  };
  error?: HttpError;
}

export interface ResponseGetOrder {
  data: Order;
  error?: HttpError;
}

export interface ResponseSusscess {
  result: string | 'OK' | 'KO';
  error?: HttpError;
}

export interface ResponseGetAnalytics {
  data: Array<StatData>;
  error?: HttpError;
}
export interface StatData {
  name: string;
  value: number;
}
