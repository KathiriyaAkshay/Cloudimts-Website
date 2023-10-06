import { createContext, useState } from "react";

export const StudyIdContext = createContext();

const StudyIdProvider = ({ children }) => {
  const [studyIdArray, setStudyIdArray] = useState([]);

  return (
    <StudyIdContext.Provider value={{ studyIdArray, setStudyIdArray }}>
      {children}
    </StudyIdContext.Provider>
  );
};

export default StudyIdProvider;
