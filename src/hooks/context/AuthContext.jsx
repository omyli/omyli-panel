// REACT
import React, { useState, useContext, useEffect } from "react";
// SERVICE
import { getLoginData } from "../../service/localStorage";

const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  let [user, setUser] = useState(null);

  useEffect(() => {
    const logedUser = getLoginData();
    if (logedUser.token) {
      const { email, role, id } = logedUser;
      _handleUser({ id, email, role });
    }
  }, []);

  const _handleUser = ({ id, email, role }) => {
    const fixedRole = role ? role.replace("ROLE_", "") : null;
    setUser({ ...user, email, role: fixedRole, id });
  };

  return (
    <AuthContext.Provider value={{ user, setUser: _handleUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};
