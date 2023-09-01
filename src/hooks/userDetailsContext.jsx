import { createContext, useState } from "react";

export const UserDetailsContext = createContext();

const UserDetailsProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({role: localStorage.getItem("role")});

  const changeUserDetails = (details) => {
    setUserDetails(details);
  };

  return (
    <UserDetailsContext.Provider value={{ userDetails, changeUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export default UserDetailsProvider;
