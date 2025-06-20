import { supabase } from '@/lib/supabase'

const signUp = async (email: string, password: string) => {
  if (!supabase) {
    console.error('Supabase client is not initialized');
    return { 
      error: {
        message: 'Authentication service is not available',
        status: 503
      }, 
      data: null 
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Auth error during signup:', error)
      return { 
        error: {
          message: error.message || 'Failed to create account',
          status: error.status
        }, 
        data: null 
      }
    }

    return { error: null, data }
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return { 
      error: {
        message: 'An unexpected error occurred',
        status: 500
      }, 
      data: null 
    }
  }
} 