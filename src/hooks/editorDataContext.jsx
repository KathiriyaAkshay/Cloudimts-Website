import { createContext, useState } from "react";

export const EditorDataContext = createContext();

const EditorDataProvider = ({ children }) => {
  const [isStudyImageSelected, setIsStudyImageSelected] = useState(false);
  const [patientData, setPatientData] = useState("");
  const [institutionData, setInstitutionData] = useState("");
  const [templateValue, setTemplateValue] = useState(null);

  return (
    <EditorDataContext.Provider
      value={{
        isStudyImageSelected,
        setIsStudyImageSelected,
        patientData,
        setPatientData,
        institutionData,
        setInstitutionData,
        templateValue,
        setTemplateValue,
      }}
    >
      {children}
    </EditorDataContext.Provider>
  );
};

export default EditorDataProvider;
