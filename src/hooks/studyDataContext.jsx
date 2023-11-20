import { createContext, useState } from "react";

export const StudyDataContext = createContext();

const StudyDataProvider = ({ children }) => {

  const [studyData, setStudyData] = useState([]);
  
  const [studyDataPayload, setStudyDataPayload] = useState({
    id: null,
    page_number: 1,
    page_size: 10,
    deleted_skip: false,
  });
  
  const [systemFilterPayload, setSystemFilterPayload] = useState({});

  return (
    <StudyDataContext.Provider
      value={{
        studyData,
        setStudyData,
        studyDataPayload,
        setStudyDataPayload,
        systemFilterPayload,
        setSystemFilterPayload,
      }}
    >
      {children}
    </StudyDataContext.Provider>
  );
};

export default StudyDataProvider;
