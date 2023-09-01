import React, { useEffect } from "react";

const DicomViewer = ({ dicomUrl }) => {
  return (
    <div id="dwv" style={{display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {dicomUrl.map((images) => (
        <div>
          <img src={images} width={200} height={200}/>
        </div>
      ))}
    </div>
  );
};

export default DicomViewer;
