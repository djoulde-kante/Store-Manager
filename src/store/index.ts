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
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
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