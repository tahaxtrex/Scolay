
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

const supabaseUrl = 'https://dedrsjthadtucwwrfcmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZHJzanRoYWR0dWN3d3JmY216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MzgwNDYsImV4cCI6MjA3NzExNDA0Nn0.8_50IV5bmb8NYQWancImpXWKd5rJfQUcXmXiN9n10ks';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
