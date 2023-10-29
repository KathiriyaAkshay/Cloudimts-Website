import { Col, Modal, Row } from "antd";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ImageCarousel = ({
  studyImages,
  show,
  setShow,
  showStudyData = false,
  studyData,
}) => {
  return (
    <Modal
      title={showStudyData ? "Normal Report" : "Study Images"}
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
      width={580}
    >
      {showStudyData && (
        <Row gutter={15}>
          <Col xs={24} md={12} className="mb">
            <span>
              <b>Report Type:</b> {studyData?.report_type}
            </span>
          </Col>
          <Col xs={24} md={12}>
            <span>
              <b>Study Description:</b> {studyData?.study_description}
            </span>
          </Col>
          <Col xs={24} md={12} className="mb">
            <span>
              <b>Reported By:</b> {studyData?.report_by?.username}
            </span>
          </Col>
          <Col xs={24} md={12} className="mb">
            <span>
              <b>Reporting Time:</b> {studyData?.reporting_time}
            </span>
          </Col>
          {studyImages?.length > 0 && (
            <Col xs={24} md={12} className="mb">
              <span>
                <b>Images</b>
              </span>
            </Col>
          )}
        </Row>
      )}
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
