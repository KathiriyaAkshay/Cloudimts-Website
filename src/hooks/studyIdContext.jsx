import { createContext, useState } from "react";

export const StudyIdContext = createContext();

const StudyIdProvider = ({ children }) => {
  const [studyIdArray, setStudyIdArray] = useState([]);
  const [studyReferenceIdArray, setStudyReferenceIdArray] = useState([]) ; 

  return (
    <StudyIdContext.Provider 
      value={{ studyIdArray, setStudyIdArray, studyReferenceIdArray, setStudyReferenceIdArray }}>
      {children}
    </StudyIdContext.Provider>
  );
};

export default StudyIdProvider;
