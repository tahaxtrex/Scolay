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
      suppliers: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string | null
          created_at: string
          description: string | null
          logo_url: string | null
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          created_at?: string
          description?: string | null
          logo_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          created_at?: string
          description?: string | null
          logo_url?: string | null
        }
        // FIX: Add Relationships property to fix Supabase type inference.
        Relationships: []
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
        // FIX: Add Relationships property to fix Supabase type inference.
        Relationships: [
          {
            foreignKeyName: "grade_levels_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
          school_id: string | null
          supplier_id: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string
          school_id?: string | null
          supplier_id?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string
          school_id?: string | null
          supplier_id?: string | null
        }
        // FIX: Add Relationships property to fix Supabase type inference.
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
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
        // FIX: Add Relationships property to fix Supabase type inference.
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
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
        // FIX: Add Relationships property to fix Supabase type inference.
        Relationships: [
          {
            foreignKeyName: "supply_lists_grade_level_id_fkey"
            columns: ["grade_level_id"]
            referencedRelation: "grade_levels"
            referencedColumns: ["id"]
          },
        ]
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
        // FIX: Add Relationships property to fix Supabase type inference.
        Relationships: [
          {
            foreignKeyName: "supply_list_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_list_items_supply_list_id_fkey"
            columns: ["supply_list_id"]
            referencedRelation: "supply_lists"
            referencedColumns: ["id"]
          },
        ]
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
export type SupplyList = Database['public']['Tables']['supply_lists']['Row'];
export type SupplyListItem = Database['public']['Tables']['supply_list_items']['Row'];
export type Supplier = Database['public']['Tables']['suppliers']['Row'];

export interface DetailedSupplyListItem {
    id: string;
    quantity: number;
    product: Product;
}

export interface CartItem extends DetailedSupplyListItem {
    selectedQuantity: number;
}