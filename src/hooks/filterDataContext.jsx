import { createContext, useState } from "react";

export const filterDataContext = createContext();

const FilterDataProvider = ({ children }) => {
  
  const [isStudyQuickFilterModalOpen, setIsStudyQuickFilterModalOpen] = useState(false) ; 

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
  
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  
  const [isAdvancedSearchModalOpen, setIsAdvancedSearchModalOpen] =
    useState(false);

  const [isStudyExportModalOpen, setIsStudyExportModalOpen] = useState(false) ; 

  const [isQuickAssignStudyModalOpen, setIsQuickAssignStudyModalOpen ] = useState(false) ;  

  const [templateOption, setTemplateOption] = useState(null); 

  const [studyUIDValue, setStudyUIDValue] = useState(null) ; 

  const [emailSupportOption, setEmailSupportOption] = useState(true) ; 
  const [phoneSupportOption, setPhoneSupportOption] = useState(false) ; 

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
        isSupportModalOpen,
        setIsSupportModalOpen,
        isAdvancedSearchModalOpen,
        setIsAdvancedSearchModalOpen,
        isStudyExportModalOpen, 
        setIsStudyExportModalOpen, 
        isQuickAssignStudyModalOpen, 
        setIsQuickAssignStudyModalOpen, 
        templateOption, 
        setTemplateOption, 
        studyUIDValue, 
        setStudyUIDValue, 
        isStudyQuickFilterModalOpen, 
        setIsStudyQuickFilterModalOpen, 
        setEmailSupportOption, 
        setPhoneSupportOption, 
        emailSupportOption, 
        phoneSupportOption
      }}
    >
      {children}
    </filterDataContext.Provider>
  );
};

export default FilterDataProvider;
