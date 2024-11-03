// context/UserContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
