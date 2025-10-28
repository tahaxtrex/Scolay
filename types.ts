// This is a simplified representation of the database schema.
// You would generate this with `supabase gen types typescript > types.ts`
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// FIX: Changed interface to type to fix Supabase type inference issues.
export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          created_at?: string
        }
      }
      grade_levels: {
        Row: {
          id: string
          name: string
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          school_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string | null
          supplier_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          supplier_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          supplier_id?: string | null
        }
      }
      supply_lists: {
        Row: {
          id: string
          grade_level_id: string
          academic_year: string
        }
        Insert: {
          id?: string
          grade_level_id: string
          academic_year: string
        }
        Update: {
          id?: string
          grade_level_id?: string
          academic_year?: string
        }
      }
      supply_list_items: {
        Row: {
          id: string
          supply_list_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          supply_list_id: string
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          supply_list_id?: string
          product_id?: string
          quantity?: number
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_email: string | null
          contact_phone: string | null
        }
        Insert: {
          id?: string
          name: string
          contact_email?: string | null
          contact_phone?: string | null
        }
        Update: {
          id?: string
          name?: string
          contact_email?: string | null
          contact_phone?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total_price: number
          delivery_option: string
          delivery_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total_price: number
          delivery_option: string
          delivery_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total_price?: number
          delivery_option?: string
          delivery_address?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_purchase?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type School = Database['public']['Tables']['schools']['Row'];
export type Grade = Database['public']['Tables']['grade_levels']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type SupplyList = Database['public']['Tables']['supply_lists']['Row'];
export type SupplyListItem = Database['public']['Tables']['supply_list_items']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];


export interface DetailedSupplyListItem {
    id: string;
    quantity: number;
    product: Product;
}

export interface CartItem extends DetailedSupplyListItem {
    selectedQuantity: number;
}