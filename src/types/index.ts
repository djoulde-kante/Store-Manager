export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  barcode: string;
  expiryDate: string;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  discount?: number;
  employeeId: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  createdAt: string;
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