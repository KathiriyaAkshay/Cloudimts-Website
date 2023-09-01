import { createContext, useState } from "react";

export const UserRoleContext = createContext();

const UserRoleProvider = ({ children }) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <UserRoleContext.Provider value={{ isRoleModalOpen, setIsRoleModalOpen }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export default UserRoleProvider;
