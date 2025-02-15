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
  const [genderOption, setGenderoption] = useState(null) ; 

  const [templateInstitutionOption, setTemplateInstitutionOption] = useState(null) ; 

  const [studyUIDValue, setStudyUIDValue] = useState(null) ; 

  const [emailSupportOption, setEmailSupportOption] = useState(true) ; 
  const [phoneSupportOption, setPhoneSupportOption] = useState(false) ; 

  const [chatNotificationData, setChatNotificationData] = useState([]) ;  

  const [billingInformationModal, setBillingInformationModal] = useState(false) ; 
  const [totalBillingReportingCharge, setTotalBillingReportingCharge] = useState(null) ; 
  const [totalBillingCommunicationCharge, setTotalCommunicationCharge] = useState(null) ; 
  const [totalBillingMidnightCharge, setTotalMidnightCharge] = useState(null) ; 

  const [patientInforamtionDrawer, setPatientInformationDrawer] = useState(false) ; 

  const [isManualStudy, setIsManualStudy] = useState(false) ; 

  return (
    <filterDataContext.Provider
      value={{
        patientInforamtionDrawer,
        setPatientInformationDrawer,
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
        phoneSupportOption, 
        chatNotificationData, 
        setChatNotificationData, 
        templateInstitutionOption, 
        setTemplateInstitutionOption, 
        billingInformationModal, 
        setBillingInformationModal, 
        totalBillingReportingCharge, 
        setTotalBillingReportingCharge, 
        totalBillingCommunicationCharge, 
        setTotalCommunicationCharge, 
        totalBillingMidnightCharge, 
        setTotalMidnightCharge, 
        genderOption, 
        setGenderoption, 
        isManualStudy,
        setIsManualStudy
      }}
    >
      {children}
    </filterDataContext.Provider>
  );
};

export default FilterDataProvider;
