import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchCurrentUser,
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  fetchProfile,
  saveProfile as apiSaveProfile
} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const u = await fetchCurrentUser();
      setUser(u);
      if (u) {
        const p = await fetchProfile();
        setProfile(p);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (payload) => {
    const data = await apiLogin(payload);
    setUser(data.user);
    const p = await fetchProfile();
    setProfile(p);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await apiRegister(payload);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setProfile(null);
  }, []);

  const saveProfile = useCallback(async (data) => {
    const saved = await apiSaveProfile(data);
    setProfile(saved);
    return saved;
  }, []);

  const refreshProfile = useCallback(async () => {
    const p = await fetchProfile();
    setProfile(p);
    return p;
  }, []);

  const hasPrerequisite = Boolean(
    profile?.prerequisite?.completedAt ||
    profile?.prerequisite?.category ||
    typeof profile?.prerequisite?.score === 'number'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        saveProfile,
        refreshProfile,
        hasPrerequisite,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
