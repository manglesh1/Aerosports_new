"use client";

import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  console.log('login called');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log('credentials checking');
  const login = (userId, password) => {
    if (userId === "admin" && password === "pwd") {
      console.log('credentials checked');
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
