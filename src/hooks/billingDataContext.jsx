import { createContext, useState } from "react";

export const BillingDataContext = createContext();

const BillingDataProvider = ({ children }) => {
  const [billingFilterData, setBillingFilterData] = useState([]);
  const [selectedData,setSelectedData]=useState([]);
  return (
    <BillingDataContext.Provider value={{ billingFilterData, setBillingFilterData,selectedData,setSelectedData }}>
      {children}
    </BillingDataContext.Provider>
  );
};

export default BillingDataProvider;
