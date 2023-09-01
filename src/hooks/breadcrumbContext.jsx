import { createContext, useState } from "react";

export const BreadcrumbContext = createContext({
  breadCrumbs: [],
  changeBreadcrumbs: (crumbs) => {},
});

const BreadcrumbProvider = ({ children }) => {
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const changeBreadcrumbs = (crumbs) => {
    setBreadCrumbs((prev) => [...crumbs]);
  };

  return (
    <BreadcrumbContext.Provider value={{ breadCrumbs, changeBreadcrumbs, isModalOpen, setIsModalOpen }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbProvider;
