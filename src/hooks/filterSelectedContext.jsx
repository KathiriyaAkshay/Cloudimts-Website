import { createContext, useState } from "react";

export const FilterSelectedContext = createContext();

const FilterSelectedProvider = ({ children }) => {
  const [isFilterSelected, setIsFilterSelected] = useState(false);

  return (
    <FilterSelectedContext.Provider
      value={{ isFilterSelected, setIsFilterSelected }}
    >
      {children}
    </FilterSelectedContext.Provider>
  );
};

export default FilterSelectedProvider;
