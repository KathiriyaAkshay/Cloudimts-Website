import React, { useEffect } from "react";
import Editor from "../../components/Editor";
import { useParams } from "react-router-dom";
import ViewReport from "../../components/ViewReport";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

const index = () => {
  const { id } = useParams();
  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const crumbs = [{ name: "Studies", to: "/studies" }];
    crumbs.push({
      name: "Advanced Report",
    });
    changeBreadcrumbs(crumbs);
    // retrieveInstitutionData();
  }, []);
  return (
    <div>
      {window.location.pathname.includes("view") ? (
        <ViewReport id={id} />
      ) : (
        <Editor id={id} />
      )}
    </div>
  );
};

export default index;
