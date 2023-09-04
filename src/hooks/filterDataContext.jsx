import { createContext, useState } from "react";

export const filterDataContext = createContext();

const FilterDataProvider = ({ children }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUserFilterModalOpen, setIsUserFilterModalOpen] = useState(false)

  return (
    <filterDataContext.Provider value={{ isFilterModalOpen, setIsFilterModalOpen, isUserFilterModalOpen, setIsUserFilterModalOpen }}>
      {children}
    </filterDataContext.Provider>
  );
};

export default FilterDataProvider;
