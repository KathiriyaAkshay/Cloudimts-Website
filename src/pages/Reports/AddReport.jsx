import React from "react";
import Editor from "../../components/Editor";
import { useParams } from "react-router-dom";

const index = () => {
  const {id} = useParams();
  return (
    <div>
      <Editor id={id}/>
    </div>
  );
};

export default index;
