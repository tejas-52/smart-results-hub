import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@srms.edu': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@srms.edu',
      name: 'Dr. Rajesh Kumar',
      role: 'admin',
      avatar: '',
      createdAt: new Date('2020-01-01'),
    },
  },
  'teacher@srms.edu': {
    password: 'teacher123',
    user: {
      id: '2',
      email: 'teacher@srms.edu',
      name: 'Prof. Priya Sharma',
      role: 'teacher',
      avatar: '',
      createdAt: new Date('2021-06-15'),
    },
  },
  'student@srms.edu': {
    password: 'student123',
    user: {
      id: '3',
      email: 'student@srms.edu',
      name: 'Amit Patil',
      role: 'student',
      avatar: '',
      createdAt: new Date('2023-08-01'),
    },
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('srms_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('srms_user');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const mockUser = mockUsers[credentials.email];
    
    if (mockUser && mockUser.password === credentials.password) {
      const user = mockUser.user;
      localStorage.setItem('srms_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('srms_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const switchRole = (role: UserRole) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, role };
      localStorage.setItem('srms_user', JSON.stringify(updatedUser));
      setAuthState({
        ...authState,
        user: updatedUser,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
