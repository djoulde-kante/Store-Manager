/*
  # Database Schema for Supermarket Management System

  1. New Tables
    - employees
    - products
    - suppliers
    - transactions
    - transaction_items
    - stock_movements

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create employees table
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'cashier')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  buy_price decimal(10,2) NOT NULL CHECK (buy_price >= 0),
  sale_price decimal(10,2) NOT NULL CHECK (sale_price >= 0),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  category text NOT NULL,
  barcode text UNIQUE,
  min_stock_level integer NOT NULL DEFAULT 10 CHECK (min_stock_level >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total decimal(10,2) NOT NULL CHECK (total >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'mobile')),
  discount decimal(10,2) DEFAULT 0 CHECK (discount >= 0),
  employee_id uuid REFERENCES employees NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transaction_items table
CREATE TABLE transaction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create stock_movements table
CREATE TABLE stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL,
  type text NOT NULL CHECK (type IN ('in', 'out')),
  reason text NOT NULL,
  employee_id uuid REFERENCES employees NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies for employees
CREATE POLICY "Employees can view all employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM employees WHERE auth_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only admins can update employees"
  ON employees FOR UPDATE
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM employees WHERE auth_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for products
CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and managers can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'manager')
  ));

CREATE POLICY "Only admins and managers can update products"
  ON products FOR UPDATE
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'manager')
  ));

CREATE POLICY "Only admins and managers can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'manager')
  ));

-- Create policies for suppliers
CREATE POLICY "Authenticated users can view suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and managers can insert suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'manager')
  ));

CREATE POLICY "Only admins and managers can update suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'manager')
  ));

CREATE POLICY "Only admins and managers can delete suppliers"
  ON suppliers FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'manager')
  ));

-- Create policies for transactions
CREATE POLICY "Users can view transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for transaction_items
CREATE POLICY "Users can view transaction items"
  ON transaction_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert transaction items"
  ON transaction_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for stock_movements
CREATE POLICY "Users can view stock movements"
  ON stock_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and managers can create stock movements"
  ON stock_movements FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM employees 
    WHERE auth_id = auth.uid() 
    AND role IN ('admin', 'manager')
  ));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to update product quantity on transaction
CREATE OR REPLACE FUNCTION update_product_quantity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET quantity = quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  INSERT INTO stock_movements (
    product_id,
    quantity,
    type,
    reason,
    employee_id
  )
  VALUES (
    NEW.product_id,
    NEW.quantity,
    'out',
    'sale',
    (SELECT employee_id FROM transactions WHERE id = NEW.transaction_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_quantity_on_sale
  AFTER INSERT ON transaction_items
  FOR EACH ROW
  EXECUTE FUNCTION update_product_quantity();