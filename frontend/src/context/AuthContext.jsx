// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { getMe } from "../services/authServices";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadUser = useCallback(async () => {
//     const token = localStorage.getItem("fhb_token");
//     if (!token) { setLoading(false); return; }
//     try {
//       const data = await getMe();
//       setUser(data.user);
//     } catch {
//       localStorage.removeItem("fhb_token");
//       localStorage.removeItem("fhb_user");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { loadUser(); }, [loadUser]);

//   const login = (token, userData) => {
//     localStorage.setItem("fhb_token", token);
//     localStorage.setItem("fhb_user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("fhb_token");
//     localStorage.removeItem("fhb_user");
//     setUser(null);
//      window.location.href = "/";
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };





import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { getMe } from "../services/authServices";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("RK");

  const loadUser = useCallback(async () => {

    const token = localStorage.getItem("fhb_token");

    if (!token) {

      setLoading(false);

      return;
    }

    try {

      const data = await getMe();

      setUser(data.user);

      if (data.user?.name) {

        setUserName(data.user.name);
      }

    } catch {

      localStorage.removeItem("fhb_token");

      localStorage.removeItem("fhb_user");

    } finally {

      setLoading(false);
    }

  }, []);

  useEffect(() => {

    loadUser();

  }, [loadUser]);

  const login = (token, userData) => {

    localStorage.setItem("fhb_token", token);

    localStorage.setItem(
      "fhb_user",
      JSON.stringify(userData)
    );

    setUser(userData);

    if (userData?.name) {

      setUserName(userData.name);
    }
  };

  const logout = () => {

    localStorage.removeItem("fhb_token");

    localStorage.removeItem("fhb_user");

    setUser(null);

    setUserName("RK");

    window.location.href = "/";
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,

        userName,
        setUserName,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};

export const useAuth = () => {

  const ctx = useContext(AuthContext);

  if (!ctx) {

    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
};