import { supabase } from '../supabase';
import { Database } from '../types';
import { PostgrestBuilder, PostgrestFilterBuilder, PostgrestResponse } from '@supabase/postgrest-js';

export class BaseRepository<T extends keyof Database['public']['Tables']> {
  protected table: T;

  constructor(table: T) {
    this.table = table;
  }

  protected get client() {
    return supabase.from(this.table);
  }

  protected async handleError(error: any) {
    console.error(`Error in ${this.table} repository:`, error);
    throw new Error(`Failed to perform operation on ${this.table}`);
  }

  protected async executeQuery<T>(
    query: PostgrestBuilder<any> | PostgrestFilterBuilder<any, any, any[]>
  ): Promise<T> {
    const response = await query;
    if (response.error) await this.handleError(response.error);
    if (!response.data) throw new Error(`No data returned from ${this.table}`);
    return response.data as T;
  }
} 