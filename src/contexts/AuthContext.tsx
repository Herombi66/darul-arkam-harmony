import React, { createContext, useState, useEffect, useContext } from 'react'; 

interface AuthContextProps { 
  isAuthenticated: boolean; 
  userRole: 'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer' | null; 
  login: (role: 'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer') => void; 
  logout: () => void; 
} 

export const AuthContext = createContext<AuthContextProps>({ 
  isAuthenticated: false, 
  userRole: null, 
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

  const login = (role: 'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer') => { 
    setIsAuthenticated(true); 
    setUserRole(role); 
  }; 

  const logout = () => { 
    setIsAuthenticated(false); 
    setUserRole(null); 
    localStorage.removeItem('token'); 
  }; 

  return ( 
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
};