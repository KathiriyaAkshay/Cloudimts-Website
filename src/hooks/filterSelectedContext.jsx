import { createContext, useState } from "react";

export const FilterSelectedContext = createContext();

const FilterSelectedProvider = ({ children }) => {
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [isAdvanceSearchSelected, setIsAdvanceSearchSelected] = useState(false);

  return (
    <FilterSelectedContext.Provider
      value={{
        isFilterSelected,
        setIsFilterSelected,
        isAdvanceSearchSelected,
        setIsAdvanceSearchSelected,
      }}
    >
      {children}
    </FilterSelectedContext.Provider>
  );
};

export default FilterSelectedProvider;
