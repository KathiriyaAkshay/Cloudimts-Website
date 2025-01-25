import { createContext, useState } from "react";

export const StudyIdContext = createContext();

const StudyIdProvider = ({ children }) => {
  const [studyIdArray, setStudyIdArray] = useState([]);
  const [studyReferenceIdArray, setStudyReferenceIdArray] = useState([]);
  const [seriesIdList, setSeriesIdList] = useState([]);
  const [totalPages, setTotalPages] = useState(0) ; 
  const [studyCountInforamtion, setStudyCountInformation] = useState({}) ; 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Store the selected row keys

  return (
    <StudyIdContext.Provider
      value={{ studyIdArray, 
        setStudyIdArray, 
        studyReferenceIdArray, 
        setStudyReferenceIdArray,  
        seriesIdList, 
        setSeriesIdList, 
        totalPages, 
        setTotalPages, 
        studyCountInforamtion, 
        setStudyCountInformation, 
        selectedRowKeys, 
        setSelectedRowKeys
      }}>
      {children}
    </StudyIdContext.Provider>
  );
};

export default StudyIdProvider;
