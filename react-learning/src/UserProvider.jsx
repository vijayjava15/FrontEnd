import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const loginUser = (name) => {
    setUsername(name);
    localStorage.setItem("username", name);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", true);
  };

  const logoutUser = () => {
    setUsername(null);
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", false);
  };

  return (
    <UserContext.Provider value={{ username, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
