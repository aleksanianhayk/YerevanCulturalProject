import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config'; // Adjust path depending on your folder structure

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [pendingStampPlaceId, setPendingStampPlaceId] = useState(null);

  // Restore active user session on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('timelens_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to restore user session:', e);
      }
    }
  }, []);

  // Save or clear user session
  const saveUserSession = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('timelens_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('timelens_user');
    }
  };

  // Register User
  const registerUser = async (credentials) => {
    const { name, email, password, age } = credentials;

    try {
      // Try calling backend endpoint if available
      const res = await fetch('${API_BASE_URL}/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, age }),
      });

      if (res.ok) {
        const data = await res.json();
        saveUserSession(data.user || data);
        setIsAuthModalOpen(false);
        if (pendingStampPlaceId) {
          claimStamp(data.user?.id || data.id, pendingStampPlaceId);
          setPendingStampPlaceId(null);
        }
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend server unavailable, falling back to local storage auth.');
    }

    // LocalStorage Fallback (Runs if backend returns 404 or fails)
    const users = JSON.parse(localStorage.getItem('timelens_users_db') || '[]');
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return { success: false, error: 'User with this email already exists.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      password,
      age,
      collectedStamps: [],
    };

    users.push(newUser);
    localStorage.setItem('timelens_users_db', JSON.stringify(users));

    saveUserSession(newUser);
    setIsAuthModalOpen(false);

    if (pendingStampPlaceId) {
      claimStamp(newUser.id, pendingStampPlaceId);
      setPendingStampPlaceId(null);
    }

    return { success: true };
  };

  // Login User
  const loginUser = async (email, password) => {
    try {
      // Try calling backend endpoint if available
      const res = await fetch('${API_BASE_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        saveUserSession(data.user || data);
        setIsAuthModalOpen(false);
        if (pendingStampPlaceId) {
          claimStamp(data.user?.id || data.id, pendingStampPlaceId);
          setPendingStampPlaceId(null);
        }
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend server unavailable, falling back to local storage auth.');
    }

    // LocalStorage Fallback (Runs if backend returns 404 or fails)
    const users = JSON.parse(localStorage.getItem('timelens_users_db') || '[]');
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: 'Invalid email or password.' };
    }

    saveUserSession(foundUser);
    setIsAuthModalOpen(false);

    if (pendingStampPlaceId) {
      claimStamp(foundUser.id, pendingStampPlaceId);
      setPendingStampPlaceId(null);
    }

    return { success: true };
  };

  // Claim Stamp
  const claimStamp = async (userId, placeId) => {
    if (!user) return;

    const alreadyHas = user.collectedStamps?.some((s) => s.placeId === placeId);
    if (alreadyHas) return;

    const newStamp = { placeId, unlockedAt: new Date().toISOString() };
    const updatedUser = {
      ...user,
      collectedStamps: [...(user.collectedStamps || []), newStamp],
    };

    saveUserSession(updatedUser);

    // Sync in local DB
    const users = JSON.parse(localStorage.getItem('timelens_users_db') || '[]');
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx !== -1) {
      users[userIdx] = updatedUser;
      localStorage.setItem('timelens_users_db', JSON.stringify(users));
    }

    // Try sync with backend
    try {
      await fetch('${API_BASE_URL}/api/auth/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, placeId }),
      });
    } catch (e) {
      // Ignore offline error
    }
  };

  const logoutUser = () => {
    saveUserSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        pendingStampPlaceId,
        setPendingStampPlaceId,
        loginUser,
        registerUser,
        claimStamp,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);