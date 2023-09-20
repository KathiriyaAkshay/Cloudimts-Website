import { createContext, useState } from "react";

export const StudyDataContext = createContext();

const StudyDataProvider = ({ children }) => {
  const [studyData, setStudyData] = useState([]);

  return (
    <StudyDataContext.Provider value={{ studyData, setStudyData }}>
      {children}
    </StudyDataContext.Provider>
  );
};

export default StudyDataProvider;
