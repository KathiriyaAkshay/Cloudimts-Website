import { createContext, useContext, useEffect, useState } from "react";
import { StudyDataContext } from "./studyDataContext";
import NotificationMessage from "../components/NotificationMessage";
const BASE_URL = import.meta.env.VITE_APP_SOCKET_BASE_URL;

export const StudyNotificationContext = createContext();

const StudyNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState("");
  const { studyData, setStudyData } = useContext(StudyDataContext);

  useEffect(() => {
    console.log(studyData);
    // setStudyData((prev) => console.log(prev));
    const ws = new WebSocket(`${BASE_URL}studies/`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData.payload.status === "update-study") {
        const updatedData = studyData.map((data) => {
          if (data.id === eventData.payload.data.id)
            return eventData.payload.data;
          else data;
        });
        setStudyData(updatedData);
        NotificationMessage(
          "success",
          `Study #${eventData.payload.data.id} has been updated`
        );
      } else if (eventData.payload.status === "Viewed") {
        const updatedData = studyData.map((data) => {
          if (data.id === eventData.payload.data.id)
            return {
              ...data,
              status: "Viewed",
              updated_at: eventData.payload.data.updated_at,
            };
          else return data;
        });
        setStudyData(updatedData);
        // NotificationMessage(
        //   "success",
        //   `Status has been updated for Study #${eventData.payload.data.id}`
        // );
      } else if (eventData.payload.status === "Delete") {
        const updatedData = studyData.filter(
          (data) => data.id !== eventData.payload.data.id
        );
        setStudyData(updatedData);
        // NotificationMessage(
        //   "success",
        //   `Study #${eventData.payload.data.id} has been deleted`
        // );
      } else if (eventData.payload.status === "Assigned") {
        const permissionId = JSON.parse(
          localStorage.getItem("all_permission_id")
        );
        if (permissionId.includes(eventData.payload.data.institution.id)) {
          setStudyData((prev) => [eventData.payload.data, ...prev]);
        }
      } else if (eventData.payload.status === "Reporting") {
        const updatedData = studyData.map((data) => {
          if (data.id === eventData.payload.data.id)
            return {
              ...data,
              status: "Reporting",
              updated_at: eventData.payload.data.updated_at,
            };
          else return data;
        });
        setStudyData(updatedData);
        NotificationMessage(
          "success",
          `Status has been updated for Study #${eventData.payload.data.id}`
        );
      } else if (eventData.payload.status === "Reported") {
        const updatedData = studyData.map((data) => {
          if (data.id === eventData.payload.data.id)
            return {
              ...data,
              status: "Reported",
              updated_at: eventData.payload.data.updated_at,
            };
          else return data;
        });
        setStudyData(updatedData);
        NotificationMessage(
          "success",
          `Status has been updated for Study #${eventData.payload.data.id}`
        );
      } else if (eventData.payload.status === "ViewReport") {
        const updatedData = studyData.map((data) => {
          if (data.id === eventData.payload.data.id)
            return {
              ...data,
              status: "ViewReport",
              updated_at: eventData.payload.data.updated_at,
            };
          else return data;
        });
        setStudyData(updatedData);
        NotificationMessage(
          "success",
          `Status has been updated for Study #${eventData.payload.data.id}`
        );
      } else if (eventData.payload.status === "ClosedStudy") {
        const updatedData = studyData.map((data) => {
          if (data.id === eventData.payload.data.id)
            return {
              ...data,
              status: "ClosedStudy",
              updated_at: eventData.payload.data.updated_at,
            };
          else return data;
        });
        setStudyData(updatedData);
        NotificationMessage(
          "success",
          `Status has been updated for Study #${eventData.payload.data.id}`
        );
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [studyData]);

  return (
    <StudyNotificationContext.Provider value={{ notification }}>
      {children}
    </StudyNotificationContext.Provider>
  );
};

export default StudyNotificationProvider;
