import { createContext, useState } from "react";

export const UserEmailContext = createContext();

const UserEmailProvider = ({ children }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <UserEmailContext.Provider value={{ isEmailModalOpen, setIsEmailModalOpen }}>
      {children}
    </UserEmailContext.Provider>
  );
};

export default UserEmailProvider;
