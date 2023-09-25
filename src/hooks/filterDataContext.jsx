import { createContext, useState } from "react";

export const filterDataContext = createContext();

const FilterDataProvider = ({ children }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUserFilterModalOpen, setIsUserFilterModalOpen] = useState(false);
  const [isEmailFilterModalOpen, setIsEmailFilterModalOpen] = useState(false);
  const [isStudyFilterModalOpen, setIsStudyFilterModalOpen] = useState(false);
  const [isBillingFilterModalOpen, setIsBillingFilterModalOpen] =
    useState(true);
  const [isRoleLogsFilterModalOpen, setIsRoleLogsFilterModalOpen] =
    useState(false);
  const [
    isInstitutionLogsFilterModalOpen,
    setIsInstitutionLogsFilterModalOpen,
  ] = useState(false);
  const [isUserLogsFilterModalOpen, setIsUserLogsFilterModalOpen] =
    useState(false);

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
        setIsBillingFilterModalOpen,
        isRoleLogsFilterModalOpen,
        setIsRoleLogsFilterModalOpen,
        isInstitutionLogsFilterModalOpen,
        setIsInstitutionLogsFilterModalOpen,
        isUserLogsFilterModalOpen,
        setIsUserLogsFilterModalOpen,
      }}
    >
      {children}
    </filterDataContext.Provider>
  );
};

export default FilterDataProvider;
