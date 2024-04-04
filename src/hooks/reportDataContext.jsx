import { createContext, useState } from "react";

export const ReportDataContext = createContext();

const ReportDataProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState({
    isPatientSelected:true,
    isInstitutionSelected: false,
    isImagesSelected: false,
    isOhifViewerSelected:false,
    templateId: null,
    isStudyDescriptionSelected: false,
  });

  const [docFiledata,setDocFileData]=useState("");




  return (
    <ReportDataContext.Provider value={{ selectedItem, setSelectedItem,docFiledata,setDocFileData }}>
      {children}
    </ReportDataContext.Provider>
  );
};

export default ReportDataProvider;
