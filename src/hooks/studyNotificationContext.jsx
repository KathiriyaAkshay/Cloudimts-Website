 import { createContext, useContext, useEffect, useState } from "react";
import { StudyDataContext } from "./studyDataContext";
import NotificationMessage from "../components/NotificationMessage";
const BASE_URL = import.meta.env.VITE_APP_SOCKET_BASE_URL;
import { StudyIdContext } from "./studyIdContext";

export const StudyNotificationContext = createContext();

const StudyNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState("");
  const { studyData, setStudyData } = useContext(StudyDataContext);
  const {setSeriesIdList, setTotalPages, seriesIdList} = useContext(StudyIdContext) ; 

  const SetupSocketConnection = () => {
    const ws = new WebSocket(`${BASE_URL}studies/`);
    
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    // Socket message handling 

    ws.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
  
        if (eventData.payload.status === "update-study") {  
          try {
            
            const { id, study, institution } = eventData.payload.data;

            setStudyData(prevStudyData => {
              const updatedData = prevStudyData.map(data =>
                data.id === id
                  ? {
                      ...data,
                      name: study?.patient_name,
                      institution: institution?.name,
                      patient_id: study?.patient_id,
                      study_id: study?.id,
                      key: id,
                      institution_id: institution?.id
                    }
                  : data
              );
              return updatedData;
            });

          } catch (error) {
            
          }
        
        } else if (eventData.payload.status === "Viewed") {
  
          // Viewed Study status handler 
          // Previous status -- Assigned, Reporting   
          setStudyData((prevStudyData) => {
            const updatedData = prevStudyData.map((data) => {
              if (data.id === eventData.payload.data.id) {
                return {
                  ...data,
                  status: "Viewed",
                  updated_at: eventData.payload.data.updated_at,
                };
              } else {
                return data;
              }
            });
            return updatedData;
          });
        
        } else if (eventData.payload.status === "Delete") {

          setStudyData(prevStudyData => {
            const studyToRemove = prevStudyData.find(data => data.id === eventData.payload.data.id);
            if (studyToRemove) {
              // If the study is found, remove it from the array
              const updatedData = prevStudyData.filter(data => data.id !== eventData.payload.data.id);
              setTotalPages(prev => prev - 1); // Decrement totalPages
              return updatedData;
            }
            return prevStudyData; // If the study is not found, return the original array
          });

        
        } else if (eventData.payload.status === "Assigned") {
  
          // Assigned study status handler 
          let StudyId = eventData.payload.data.id ; 
          let InstitutionId = eventData.payload.data?.institution?.id ;
          
          let updateStudyStatus = 0 ; 
  
          setStudyData((prev) => {
            return prev.map((element) => {
              if (element.id === StudyId){  
                updateStudyStatus = 1; 
                
                return {...element, 
                  status: eventData.payload.data.assign_user !== null?"Assigned":element?.status , 
                  updated_at: eventData.payload.data.updated_at, 
                  study_description: eventData.payload.data.study_description, 
                  assign_user: eventData.payload.data.assign_user, 
                  top_assign: eventData.payload.data.top_assign, 
                  urgent_case: eventData?.payload?.data?.urgent_case
                } ;
                 
              } else{
                return {...element} ; 
              }
            })
          })

          setTotalPages((prev) => prev + 1) ; 

          const temp = studyData
            .map(data => data?.study?.study_original_id)
            .filter(Boolean); temp ; 

            const uniqueItem = [...new Set(temp)] ; 
            setSeriesIdList([...uniqueItem]) ; 
  
          let AllPermissionId = JSON.parse(localStorage.getItem("all_permission_id")) ; 
          let AllAssignId = JSON.parse(localStorage.getItem("all_assign_id")) ; 
  
          if (AllPermissionId.includes(InstitutionId) && updateStudyStatus === 0){
            setStudyData((prev) => [{...eventData.payload.data, 
              name: eventData.payload.data.study.patient_name,
              institution: eventData.payload.data.institution.name, 
              patient_id: eventData.payload.data.study.patient_id, 
              study_id: eventData.payload.data.study.id, 
              urgent_case: eventData?.payload?.data?.urgent_case} , ...prev]) ; 

            // Update SeriesID

            const temp = studyData
            .map(data => data?.study?.study_original_id)
            .filter(Boolean); temp ; 

            const uniqueItem = [...new Set(temp)] ; 
            setSeriesIdList([...uniqueItem]) ; 
          } else {
  
            if (AllAssignId.includes(InstitutionId) && updateStudyStatus === 0){
              setStudyData((prev) => [{...eventData.payload.data, 
                name: eventData.payload.data.study.patient_name,
                institution: eventData.payload.data.institution.name, 
                patient_id: eventData.payload.data.study.patient_id, 
                study_id: eventData.payload.data.study.id, 
                urgent_case: eventData?.payload?.data?.urgent_case  
              } , ...prev]) ; 

              // Update SeriesID

              const temp = studyData
              .map(data => data?.study?.study_original_id)
              .filter(Boolean); temp ; 

              const uniqueItem = [...new Set(temp)] ; 
              setSeriesIdList([...uniqueItem]) ; 
            }
          }
  
        
        } else if (eventData.payload.status === "Un-Assigned") {
  
          // Assigned study status handler 
          let StudyId = eventData.payload.data.id ; 
          let InstitutionId = eventData.payload.data?.institution?.id ;
          
          let updateStudyStatus = 0 ; 
  
          setStudyData((prev) => {
            return prev.map((element) => {
              if (element.id === StudyId){  
                updateStudyStatus = 1; 
                
                return {...element, status: "Un-Assigned" , 
                  updated_at: eventData.payload.data.updated_at, 
                  study_description: eventData.payload.data.study_description, 
                  assign_user: eventData.payload.data.assign_user, 
                  top_assign: eventData.payload.data.top_assign
                } ;
                 
              } else{
                return {...element} ; 
              }
            })
          })
  
          let AllPermissionId = JSON.parse(localStorage.getItem("all_permission_id")) ; 
          let AllAssignId = JSON.parse(localStorage.getItem("all_assign_id")) ; 
  
          if (AllPermissionId.includes(InstitutionId) && updateStudyStatus === 0){
            setStudyData((prev) => [{...eventData.payload.data, 
              name: eventData.payload.data.study.patient_name,
              institution: eventData.payload.data.institution.name, 
              patient_id: eventData.payload.data.study.patient_id, 
              study_id: eventData.payload.data.study.id} , ...prev]) ; 
          } else {
  
            if (AllAssignId.includes(InstitutionId) && updateStudyStatus === 0){
              setStudyData((prev) => [{...eventData.payload.data, 
                name: eventData.payload.data.study.patient_name,
                institution: eventData.payload.data.institution.name, 
                patient_id: eventData.payload.data.study.patient_id, 
                study_id: eventData.payload.data.study.id} , ...prev]) ; 
            }
          }
  
        
        } else if (eventData.payload.status === "Reporting") {
          
          setStudyData((prevStudyData) => {
            const updatedData = prevStudyData.map((data) => {
              if (data.id === eventData.payload.data.id) {
                return {
                  ...data,
                  status: "InReporting",
                  updated_at: eventData.payload.data.updated_at,
                };
              } else {
                return data;
              }
            });
            return updatedData;
          });     
        } else if (eventData.payload.status === "Reported") {

          setStudyData((prevStudyData) => {
            const updatedData = prevStudyData.map((data) => {
              if (data.id == eventData.payload.data.id) {
                NotificationMessage(
                  "success",
                  `Study #${eventData.payload.data.id} Reported successfully`, 
                  "", 
                  5
                );
                
                return {
                  ...data,
                  status: "Reported",
                  updated_at: eventData.payload.data.updated_at,
                };
              } else {
                return data;
              }
            });
            return updatedData;
          });
          
  
        
        } else if (eventData.payload.status === "ViewReport") {
  
          setStudyData((prevStudyData) => {
            return prevStudyData.map((data) => {
              if (data.id === eventData.payload.data.id) {
                return {
                  ...data,
                  status: "ViewReport",
                  updated_at: eventData.payload.data.updated_at,
                };
              } else {
                return data;
              }
            });
          }); 
          
        
        } else if (eventData.payload.status === "ClosedStudy") {
  
          setStudyData((prevStudyData) => {
            return prevStudyData.map((data) => {
              if (data.id === eventData.payload.data.id) {
                return {
                  ...data,
                  status: "ClosedStudy",
                  updated_at: eventData.payload.data.updated_at,
                };
              } else {
                return data;
              }
            });
          });
          
        
        } else if (eventData.payload.status === "RemoveAssign"){
  
          let Custome_user_id = localStorage.getItem("custom_user_id") ; 
          let StudyId = eventData.payload.data.id ; 
          let UserId = eventData.payload.data.remove_user ; 
  
          if (Custome_user_id == UserId){
              const updatedData = studyData.map((data) => {
              
              if (data.id !== eventData.payload.data.id) {
                return data;
              
              } 
              return null; 
            }).filter((data) => data !== null);
            
            setStudyData(updatedData);
          } 
        } else if (eventData.payload.status === "NewStudy"){ 

          console.log("New study information fetch ------------>");

          // Handle newstudies information 
          let InstitutionId = eventData?.payload?.data?.institution?.id ;   
          let AllPermissionId = JSON.parse(localStorage.getItem("all_permission_id")) ; 
          
          if (AllPermissionId.includes(InstitutionId)){
            console.log("Match institution id ---------------->");
            setStudyData((prev) => [{...eventData.payload.data, 
              name: eventData.payload.data.study.patient_name,
              institution: eventData.payload.data.institution.name, 
              patient_id: eventData.payload.data.study.patient_id, 
              study_id: eventData.payload.data.study.id} , 
            ...prev]) ; 

            // Update SeriesID
            setTotalPages((prev) => prev + 1) ; 

            console.log("Previous study id list information ----------->");
            console.log(seriesIdList);

            const temp = studyData
            .map(data => data?.study?.study_original_id)
            .filter(Boolean);

            const uniqueItem = [...new Set(temp)] ; 
            console.log("Total updated studyid information ------------>");
            console.log(uniqueItem);
            setSeriesIdList([...uniqueItem]) ; 

          }
        }
        
      } catch (error) {
        
      }

    };

    // Socket Connection closed handling 
    
    ws.onclose = () => {
      console.log("Studies socket connection closed");
    };

    return () => {
      ws.close();
    };
  }

  const [reloadValue, setReloadValue] = useState(0);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setReloadValue(prev => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    SetupSocketConnection() ; 
  }, [reloadValue]);

  return (
    <StudyNotificationContext.Provider value={{ notification }}>
      {children}
    </StudyNotificationContext.Provider>
  );
};

export default StudyNotificationProvider;
