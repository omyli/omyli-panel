// REACT
import React, { useState, useContext, useEffect } from "react";
// SERVICE
import {
  getLoginData,
  getCollapsedMenu,
  setCollapsedMenu as setCollapsedMenuLocalStorage,
} from "../../service/localStorage";

const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  const [collapsedMenu, setCollapsedMenu] = useState(false);

  useEffect(() => {
    const logedUser = getLoginData();
    if (logedUser.token) {
      const { email, role, id } = logedUser;
      _handleUser({ id, email, role });
    }
  }, []);

  useEffect(() => {
    const collapsedMenuFromLocalStorage = getCollapsedMenu();
    console.log("collapsedMenuFromLocalStorage", collapsedMenuFromLocalStorage);
    setCollapsedMenu(collapsedMenuFromLocalStorage);
  }, []);

  const _handleUser = ({ id, email, role }) => {
    const fixedRole = role ? role.replace("ROLE_", "") : null;
    setUser({ ...user, email, role: fixedRole, id });
  };

  const _handleCollapsedMenu = () => {
    setCollapsedMenuLocalStorage(!collapsedMenu);
    setCollapsedMenu(!collapsedMenu);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: _handleUser,
        collapsedMenu,
        setCollapsedMenu: _handleCollapsedMenu,
      }}
    >
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
