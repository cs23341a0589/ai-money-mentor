export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      financial_profiles: {
        Row: {
          id: string
          user_id: string
          age: number
          monthly_income: number
          monthly_expenses: number
          current_savings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age?: number
          monthly_income?: number
          monthly_expenses?: number
          current_savings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number
          monthly_income?: number
          monthly_expenses?: number
          current_savings?: number
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          category: string
          amount: number
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          amount: number
          description?: string
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          amount?: number
          description?: string
          date?: string
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_amount: number
          current_amount: number
          deadline: string
          monthly_contribution: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_amount: number
          current_amount?: number
          deadline: string
          monthly_contribution?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          target_amount?: number
          current_amount?: number
          deadline?: string
          monthly_contribution?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
