import React from "react";
import Editor from "../../components/Editor";
import { useParams } from "react-router-dom";
import ViewReport from "../../components/ViewReport";

const index = () => {
  const { id } = useParams();
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
