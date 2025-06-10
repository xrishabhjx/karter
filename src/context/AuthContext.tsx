// Authentication context provider for managing user authentication state
// Authentication context provider for managing user authentication state
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';
import toast from 'react-hot-toast';

/**
 * AuthContext - Provides authentication state and methods throughout the app
 * Features:
 * - User authentication state
 * - Login/Logout functionality
 * - Registration
 * - OAuth integration
 * - Session management
 */
// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  googleLogin: () => Promise<void>;
}

// Get environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Initialize Supabase client with authentication configuration
// Initialize Supabase client with authentication configuration
const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component
/**
 * AuthProvider - Main authentication context provider component
 * Handles:
 * - User session management
 * - Authentication state updates
 * - Profile management
 * - OAuth flows
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state and set up listeners
  // Initialize authentication state and set up listeners
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          await handleUserSession(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          await handleUserSession(session.user);
        } else {
          setUser(null);
          localStorage.removeItem('karter_user');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle user session data
  const handleUserSession = async (authUser: any) => {
    try {
      // Get user profile data from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore "not found" error for new users
        throw error;
      }

      // Create user data object
      const userData: User = {
        id: authUser.id,
        name: profile?.name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
        email: authUser.email || '',
        phone: profile?.phone || authUser.user_metadata?.phone || '',
        role: profile?.role || 'user',
        verified: true,
        profileImage: authUser.user_metadata?.avatar_url || profile?.profileImage,
      };

      // Create profile if it doesn't exist
      if (!profile) {
        console.log('Creating new user profile:', userData);
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            profileImage: userData.profileImage,
          }]);

        if (createError) throw createError;
      }

      setUser(userData);
      localStorage.setItem('karter_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error handling user session:', error);
      toast.error('Error loading user profile');
    }
  };

  // Google OAuth login
  // Google OAuth login handler
  const googleLogin = async () => {
    try {
      console.log('Initiating Google login...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      console.log('Google OAuth response:', data);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google. Please try again.');
      throw error;
    }
  };

  // Email/Password login
  // Email/Password login handler
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        await handleUserSession(data.user);
        toast.success('Login successful');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User registration
  // User registration handler
  const register = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role || 'user',
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        await handleUserSession(data.user);
        toast.success('Registration successful');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('karter_user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Error logging out');
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};