// /providers/UserProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ initialUser, children }:any) => {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return context;
  };