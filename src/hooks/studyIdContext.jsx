import { createContext, useState } from "react";

export const StudyIdContext = createContext();

const StudyIdProvider = ({ children }) => {
  const [studyIdArray, setStudyIdArray] = useState([]);
  const [studyReferenceIdArray, setStudyReferenceIdArray] = useState([]);
  const [seriesIdList, setSeriesIdList] = useState([]);
  const [totalPages, setTotalPages] = useState(0)

  return (
    <StudyIdContext.Provider
      value={{ studyIdArray, 
        setStudyIdArray, 
        studyReferenceIdArray, 
        setStudyReferenceIdArray,  
        seriesIdList, 
        setSeriesIdList, 
        totalPages, 
        setTotalPages
      }}>
      {children}
    </StudyIdContext.Provider>
  );
};

export default StudyIdProvider;
