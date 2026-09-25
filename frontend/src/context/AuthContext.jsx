import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { usersAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!mounted) return;
      if (authUser) {
        try {
          const { data: { data: profile } } = await usersAPI.getMyProfile();
          setUser({ ...authUser, ...profile });
        } catch {
          setUser(authUser);
        }
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (!session?.user) setUser(null);
      else setUser(session.user);
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: { data: profile } } = await usersAPI.getMyProfile();
    const mergedUser = { ...data.user, ...profile };
    setUser(mergedUser);
    return { user: mergedUser, session: data.session };
  };

  const register = async (userData) => {
    const { email, password, fullName = '', role = 'labour', ...metadata } = userData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, role, ...metadata },
      },
    });
    if (error) throw error;
    if (data.session) setUser(data.user);
    return { user: data.user, session: data.session, requiresEmailConfirmation: !data.session };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (userData) => {
    const { data: { data } } = await usersAPI.updateProfile(userData);
    const mergedUser = { ...user, ...data };
    setUser(mergedUser);
    return { user: mergedUser };
  };

  const refreshUser = async () => {
    const { data: { data } } = await usersAPI.getMyProfile();
    setUser((current) => ({ ...current, ...data }));
    return data;
  };

  const value = { user, loading, login, register, logout, updateUser, refreshUser, isAuthenticated: !!user, isLabour: user?.role === 'labour', isContractor: user?.role === 'contractor' };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
