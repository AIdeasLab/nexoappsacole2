import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with retry configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  // Add retry configuration
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enhanced error handler with retry logic
export async function handleSupabaseRequest<T>(
  request: () => Promise<{ data: T | null; error: any }>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await request();
      
      if (error) {
        console.error(`Attempt ${i + 1}/${retries} failed:`, error);
        
        if (i === retries - 1) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      return data as T;
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      
      console.error(`Attempt ${i + 1}/${retries} failed:`, error);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw new Error('All retry attempts failed');
}

// Improved error handling wrapper
export const handleSupabaseError = (error: any) => {
  // Log the full error for debugging
  console.error('Supabase error details:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });

  // Return user-friendly error messages
  if (error.code === 'PGRST301' || error.code === 'PGRST204') {
    throw new Error('Erro de conexão com o banco de dados. Por favor, tente novamente em alguns instantes.');
  }
  
  if (error.code === '23505') {
    throw new Error('Este registro já existe.');
  }
  
  if (error.code === '23503') {
    throw new Error('O registro relacionado não existe.');
  }

  if (error.message?.includes('Failed to fetch')) {
    throw new Error('Erro de conexão. Verificando sua conexão com a internet...');
  }

  // Default error message
  throw new Error(error.message || 'Ocorreu um erro ao acessar o banco de dados.');
};

// Connection test helper with retry
export const testConnection = async () => {
  return handleSupabaseRequest(async () => {
    return await supabase
      .from('projects')
      .select('count')
      .limit(1)
      .single();
  });
};