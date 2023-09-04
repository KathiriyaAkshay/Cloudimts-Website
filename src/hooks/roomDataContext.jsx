import { createContext, useState } from "react";

export const RoomDataContext = createContext();

const RoomDataProvider = ({ children }) => {
  const [roomID, setRoomID] = useState(null);

  return (
    <RoomDataContext.Provider value={{ roomID, setRoomID }}>
      {children}
    </RoomDataContext.Provider>
  );
};

export default RoomDataProvider;
