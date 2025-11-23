import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      // Decodifica o token para obter dados do usuário (opcional)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('[AuthContext] Payload JWT decodificado:', payload);
        setUser({
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          tenantId: payload.tenantId,
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  function login(token) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
