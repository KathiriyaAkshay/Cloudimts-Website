import { createContext, useState } from "react";

export const BillingDataContext = createContext();

const BillingDataProvider = ({ children }) => {
  const [billingFilterData, setBillingFilterData] = useState({});

  return (
    <BillingDataContext.Provider value={{ billingFilterData, setBillingFilterData }}>
      {children}
    </BillingDataContext.Provider>
  );
};

export default BillingDataProvider;
