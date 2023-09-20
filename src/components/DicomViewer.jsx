import React, { useEffect, useState } from "react";
import { getInstanceData, getStudyImages } from "../apis/studiesApi";
import { Badge, Spin } from "antd";
const BASE_URL = import.meta.env.VITE_APP_BE_ENDPOINT;

const DicomViewer = ({ dicomUrl }) => {
  const [imageData, setImageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (dicomUrl) {
      retrieveStudyInstance(dicomUrl);
    }
  }, []);

  const retrieveStudyImages = (id, instances) => {
    setIsLoading(true);
    getStudyImages(id)
      .then((res) => {
        setImageData((prev) => [
          ...prev,
          {
            image: `${BASE_URL}studies/v1/fetch_instance_image/${id}`,
            instances,
          },
        ]);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
    //  fetch(`/studies/v1/fetch_instance_image/${id}`, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //   })
    //     .then((res) => res.blob())
    //     .then((data) => {
    //       const reader = new FileReader();
    //       reader.onloadend = () => {
    //         console.log(reader.result)
    //         setImageData((prev) => [...prev, reader.result.replace("data:text/html", "data:image/png")])
    //       };
    //       reader.readAsDataURL(data);
    //     });
  };

  const retrieveStudyInstance = (id) => {
    setIsLoading(true);
    getInstanceData({ study_id: id })
      .then((res) => {
        res.data.data.map((data) =>
          retrieveStudyImages(data.seriesInstance, data.instances)
        );
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  console.log(imageData);
  return (
    <Spin spinning={isLoading}>
    <div
      id="dwv"
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        padding: "10px",
      }}
    >
      {imageData?.map((images) => (
        <div>
          <Badge count={images.instances} showZero offset={[-12, 12]}>
            <img
              id="imageElement"
              src={images.image}
              width={200}
              height={200}
            />
          </Badge>
        </div>
      ))}
    </div>
    </Spin>
  );
};

export default DicomViewer;
