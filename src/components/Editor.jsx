import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useContext, useEffect, useState } from "react";
import "../../ckeditor5/build/ckeditor";
import { Button, Card, Col, Divider, Row, Typography } from "antd";
import { getMoreDetails } from "../apis/studiesApi";
import { ReportDataContext } from "../hooks/reportDataContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image from "../assets/images/backgroundImg.jpg";
import Slider from "react-slick";

const Editor = ({ id }) => {
  const [editorData, setEditorData] = useState("");
  const [cardDetails, setCardDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { selectedItem, setSelectedItem } = useContext(ReportDataContext);
  const [studyImageID, setStudyImageID] = useState(0);

  useEffect(() => {
    setSelectedItem((prev) => ({
      isPatientSelected: true,
      isInstitutionSelected: false,
      isImagesSelected: false,
    }));
  }, []);

  useEffect(() => {
    retrievePatientDetails();
  }, []);

  const retrievePatientDetails = () => {
    setIsLoading(true);
    getMoreDetails({ id })
      .then((res) => {
        const resData = {
          ...res.data.data,
          patientDetails:
            res.data.data?.information?.study__study_metadata
              ?.PatientMainDicomTags,
          modality:
            res.data.data?.information?.series_metadata?.MainDicomTags
              ?.modality,
          mainTags:
            res.data.data?.information?.study__study_metadata?.MainDicomTags,
          images: res.data.data?.information?.study_data?.images,
          institution_name: res.data.data?.information?.institution__name,
        };
        setCardDetails(resData);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const convertPatientDataToTable = () => {
    const data = selectedItem.isPatientSelected
      ? `<div>
        <h2>Patient Information</h2>
        <table>
          <tbody>
            <tr>
              <td>Patient ID:</td>
              <td>${cardDetails?.patientDetails?.PatientID}</td>
            </tr>
            <tr>
              <td>Patient Name:</td>
              <td>${cardDetails?.patientDetails?.PatientName}</td>
            </tr>
            <tr>
              <td>Patient Sex:</td>
              <td>${cardDetails?.patientDetails?.PatientSex}</td>
            </tr>
            <tr>
              <td>Patient Birth Date:</td>
              <td>${cardDetails?.patientDetails?.PatientBirthDate}</td>
            </tr>
          </tbody>
        </table>
      </div>`
      : selectedItem.isInstitutionSelected
      ? `<div>
      <h2>Institution Information</h2>
      <table>
        <tbody>
          <tr>
            <td>Institution Name</td>
            <td>${cardDetails?.institution_name}</td>
          </tr>
        </tbody>
      </table>
    </div>`
      : `<figure class="image"><img src=${imageSlider[studyImageID]?.url} alt="study image"></figure>
    `;
    setEditorData((prev) => `${prev}${data}`);
  };

  const imageSlider = [
    {
      url: image,
    },
    {
      url: image,
    },
    {
      url: image,
    },
  ];

  return (
    <>
      <div>
        <Card
          style={{ minHeight: "calc(100vh - 200px)" }}
          className="report-card"
        >
          <Row gutter={30}>
            <Col xs={24} sm={12} md={12}>
              <div className="report-details-div">
                {selectedItem?.isPatientSelected && (
                  <>
                    <Typography className="card-heading">
                      Patient Information
                    </Typography>
                    <div>
                      <Divider />
                      <div className="report-main-div">
                        <Typography className="report-text-primary">
                          Patient ID:
                        </Typography>
                        <Typography>
                          {cardDetails?.patientDetails?.PatientID}
                        </Typography>
                      </div>
                      <div className="report-main-div">
                        <Typography className="report-text-primary">
                          Patient Name:
                        </Typography>
                        <Typography>
                          {cardDetails?.patientDetails?.PatientName}
                        </Typography>
                      </div>
                      <div className="report-main-div">
                        <Typography className="report-text-primary">
                          Gender:
                        </Typography>
                        <Typography>
                          {cardDetails?.patientDetails?.PatientSex}
                        </Typography>
                      </div>
                      <div className="report-main-div">
                        <Typography className="report-text-primary">
                          Date of Birth:
                        </Typography>
                        <Typography>
                          {cardDetails?.patientDetails?.PatientBirthDate}
                        </Typography>
                      </div>
                      <div className="report-main-div">
                        <Typography className="report-text-primary">
                          Accession Number:
                        </Typography>
                        <Typography>
                          {cardDetails?.mainTags?.AccessionNumber}
                        </Typography>
                      </div>
                    </div>
                  </>
                )}
                {selectedItem?.isInstitutionSelected && (
                  <>
                    <Typography className="card-heading">
                      Institution Information
                    </Typography>
                    <div>
                      <Divider />
                      <div className="report-main-div">
                        <Typography className="report-text-primary">
                          Institution Name:
                        </Typography>
                        <Typography>{cardDetails?.institution_name}</Typography>
                      </div>
                    </div>
                  </>
                )}
                {selectedItem?.isImagesSelected && (
                  <>
                    <Typography className="card-heading">
                      Study Images
                    </Typography>
                    <Divider />

                    <div className="menu-image-slider">
                      <Slider
                        dots={false}
                        className="slider"
                        slidesToShow={1}
                        slidesToScroll={1}
                        infinite={false}
                        afterChange={(prev) => setStudyImageID(prev)}
                      >
                        {imageSlider.map((image) => (
                          <img
                            src={image.url}
                            alt="image"
                            className="slider-image"
                          />
                        ))}
                      </Slider>
                    </div>
                  </>
                )}
                <div className="btn-div">
                  <Button type="primary" onClick={convertPatientDataToTable}>
                    Insert
                  </Button>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <CKEditor
                editor={ClassicEditor}
                data={editorData}
                // onReady={(editor) => {
                //   editor.plugins.get("FileRepository").createUploadAdapter = (
                //     loader
                //   ) => {
                //     return new UploadAdapter(loader);
                //   };
                // }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditorData(data);
                }}
              />
            </Col>
          </Row>
        </Card>
      </div>
      {/* <div>
        <h3>Editor Output:</h3>
        <div dangerouslySetInnerHTML={{ __html: editorData }} />
      </div> */}
    </>
  );
};

export default Editor;
