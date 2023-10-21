import { Modal } from "antd";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ImageCarousel = ({ studyImages, show, setShow }) => {
  return (
    <Modal
      title="Study Images"
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <div className="study-image-slider">
        <Slider
          dots={false}
          className="slider"
          slidesToShow={1}
          slidesToScroll={1}
          infinite={false}
          // variableWidth={true}
        >
          {studyImages?.map((image) => (
            <>
              <img
                src={image}
                alt="image"
                style={{ width: "500px", height: "300px" }}
              />
            </>
          ))}
        </Slider>
      </div>
    </Modal>
  );
};

export default ImageCarousel;
