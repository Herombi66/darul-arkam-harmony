import React, { createContext, useState, useEffect, useContext } from 'react'; 

interface UserPayload {
  id: string;
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer';
  name?: string;
  email?: string;
  roll_number?: string;
  id_number?: string;
  isActive?: boolean;
}

interface AuthContextProps { 
  isAuthenticated: boolean; 
  userRole: 'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer' | null; 
  token: string | null;
  user: UserPayload | null;
  login: (payload: { token: string; role: AuthContextProps['userRole']; user: UserPayload }) => void; 
  logout: () => void; 
} 

export const AuthContext = createContext<AuthContextProps>({ 
  isAuthenticated: false, 
  userRole: null, 
  token: null,
  user: null,
  login: () => {}, 
  logout: () => {}, 
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer' | null>(null); 
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role') as AuthContextProps['userRole'] | null;
    const savedUserStr = localStorage.getItem('user');
    const savedUser = savedUserStr ? (JSON.parse(savedUserStr) as UserPayload) : null;
    if (savedToken && savedRole && savedUser) {
      setToken(savedToken);
      setUserRole(savedRole);
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (payload: { token: string; role: AuthContextProps['userRole']; user: UserPayload }) => { 
    setIsAuthenticated(true); 
    setUserRole(payload.role); 
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem('token', payload.token);
    if (payload.role) localStorage.setItem('role', payload.role);
    localStorage.setItem('user', JSON.stringify(payload.user));
  }; 

  const logout = () => { 
    setIsAuthenticated(false); 
    setUserRole(null); 
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); 
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }; 

  return ( 
    <AuthContext.Provider value={{ isAuthenticated, userRole, token, user, login, logout }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
};
