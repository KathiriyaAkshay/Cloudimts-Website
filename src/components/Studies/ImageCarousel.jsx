import { Col, Modal, Row, Image, Button, Tooltip } from "antd";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import PDFOptionIcon from "../../assets/images/pdf-file.png" ; 

const ImageCarousel = ({
  studyImages,
  show,
  setShow,
  showStudyData = false,
  studyData,
}) => {

  function isPDF(url) {
    const fileExtension = url.split('.').pop().toLowerCase();
    return fileExtension === 'pdf';
  }

  function getFileNameFromURL(url) {
    // Extract the last part of the URL after the last slash
    const pathSegments = url.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
  
    // Extract the file name using a regular expression to remove query parameters
    const fileName = lastSegment.replace(/[\?|#].*$/, '');
  
    return fileName;
  }

  const onDownload = (imageUrl) => {
    // fetch(src)
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     const url = URL.createObjectURL(new Blob([blob]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'image.png';
    //     document.body.appendChild(link);
    //     link.click();
    //     URL.revokeObjectURL(url);
    //     link.remove();
    // });

    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = "_blank" ; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (

    <Modal
      title={showStudyData ? "Normal Report" : "Study Images"}
      open={show}
      onCancel={() => setShow(false)}
      footer={null}
      width={580}
      className = "Normal-report-view-option-modal"
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

      {/* ==== Report reference image information slider ====  */}

      <div className="study-image-slider">
        <Slider
          dots={false}
          className="slider"
          slidesToShow={1}
          slidesToScroll={1}
          infinite={false}
        >
          {studyImages?.map((image) => (
            <>

              <Tooltip title = {getFileNameFromURL(image)}>
                <Button style={{marginLeft: "auto", marginBottom: "0.50rem"}} 
                  icon= {<DownloadOutlined/>}
                  onClick={() => onDownload(image)}></Button>
              </Tooltip>

              <Image
                src={isPDF(image)?PDFOptionIcon:image}
                alt="image"
                style={{ width: "500px", height: "300px" }}
                preview={{
                  toolbarRender: (
                    _,
                    {
                      transform: { scale },
                      actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                    },
                  ) => (
                    <Space size={12} className="toolbar-wrapper">
                      <SwapOutlined rotate={90} onClick={onFlipY} />
                      <SwapOutlined onClick={onFlipX} />
                      <RotateLeftOutlined onClick={onRotateLeft} />
                      <RotateRightOutlined onClick={onRotateRight} />
                      <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                      <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                    </Space>
                  ),
                }}
              />
            </>
          ))}
        </Slider>
      </div>
    </Modal>
  );
};

export default ImageCarousel;
