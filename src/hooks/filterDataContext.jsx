import { createContext, useState } from "react";

export const filterDataContext = createContext();

const FilterDataProvider = ({ children }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUserFilterModalOpen, setIsUserFilterModalOpen] = useState(false);
  const [isEmailFilterModalOpen, setIsEmailFilterModalOpen] = useState(false);
  const [isStudyFilterModalOpen, setIsStudyFilterModalOpen] = useState(false);
  const [isBillingFilterModalOpen, setIsBillingFilterModalOpen] = useState(true);

  return (
    <filterDataContext.Provider
      value={{
        isFilterModalOpen,
        setIsFilterModalOpen,
        isUserFilterModalOpen,
        setIsUserFilterModalOpen,
        isEmailFilterModalOpen,
        setIsEmailFilterModalOpen,
        isStudyFilterModalOpen,
        setIsStudyFilterModalOpen,
        isBillingFilterModalOpen,
        setIsBillingFilterModalOpen
      }}
    >
      {children}
    </filterDataContext.Provider>
  );
};

export default FilterDataProvider;
