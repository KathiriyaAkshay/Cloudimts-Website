import { createContext, useState } from "react";

export const ReportDataContext = createContext();

const ReportDataProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState({
    isPatientSelected: false,
    isInstitutionSelected: false,
    isImagesSelected: false,
    isOhifViewerSelected:false,
    templateId: null,
    isStudyDescriptionSelected: false,
  });

  return (
    <ReportDataContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </ReportDataContext.Provider>
  );
};

export default ReportDataProvider;
