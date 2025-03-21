export interface Product {
  id: string;
  name: string;
  description?: string;
  buy_price: number;
  sale_price: number;
  quantity: number;
  category: string;
  barcode?: string;
  min_stock_level: number;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  products: any[]; // This will be updated later when we implement supplier-product relationships
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  total: number;
  paymentMethod: string;
  discount: number;
  employeeId: string;
  items: TransactionItem[];
  createdAt: string;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface Employee {
  id: string;
  authId?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  employeeId: string;
  createdAt: string;
}