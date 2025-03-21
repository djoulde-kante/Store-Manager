import { create } from 'zustand';
import { Product, Supplier, Transaction, Employee } from '../types';
import { supabase } from '../lib/supabase';

interface StoreState {
  products: Product[];
  suppliers: Supplier[];
  transactions: Transaction[];
  employees: Employee[];
  currentUser: Employee | null;
  setProducts: (products: Product[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setCurrentUser: (employee: Employee | null) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  suppliers: [],
  transactions: [],
  employees: [],
  currentUser: null,
  setProducts: (products) => set({ products }),
  setSuppliers: (suppliers) => set({ suppliers }),
  setTransactions: (transactions) => set({ transactions }),
  setEmployees: (employees) => set({ employees }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  
  fetchProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    set({ products: data || [] });
  },
  
  addProduct: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
    
    if (data) {
      set({ products: [...get().products, data[0]] });
    }
  },
  
  updateProduct: async (id, product) => {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    set({
      products: get().products.map((p) => 
        p.id === id ? { ...p, ...product } : p
      )
    });
  },
  
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    set({
      products: get().products.filter((p) => p.id !== id)
    });
  },
  
  signIn: async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (user) {
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (employeeError) {
        throw new Error('Failed to fetch employee data');
      }

      if (employeeData) {
        set({ currentUser: employeeData });
      } else {
        throw new Error('No employee record found');
      }
    }
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null });
  },
}));