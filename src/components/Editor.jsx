import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useContext, useEffect, useState } from "react";
import "../../ckeditor5/build/ckeditor";
import { Button, Card, Col, Divider, Row, Spin, Typography } from "antd";
import {
  fetchTemplate,
  fetchUserSignature,
  getMoreDetails,
  saveAdvancedFileReport,
} from "../apis/studiesApi";
import { ReportDataContext } from "../hooks/reportDataContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image from "../assets/images/backgroundImg.jpg";
import Slider from "react-slick";
import NotificationMessage from "./NotificationMessage";
import { useNavigate } from "react-router-dom";

const Editor = ({ id }) => {
  const [editorData, setEditorData] = useState("");
  const [cardDetails, setCardDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { selectedItem, setSelectedItem } = useContext(ReportDataContext);
  const [studyImageID, setStudyImageID] = useState(0);
  const [signatureImage, setSignatureImage] = useState(null);
  const [username, setUsername] = useState("");
  const user_id = localStorage.getItem("userID");
  const navigate = useNavigate();
  const [isPatientInformationInserted, setIsPatientInformationInserted] =
    useState(false);
  const [
    isInstitutionInformationInserted,
    setIsInstitutionInformationInserted,
  ] = useState(false);
  const [isStudyDescriptionInserted, setIsStudyDescriptionInserted] =
    useState(false);

  useEffect(() => {
    setSelectedItem((prev) => ({
      isPatientSelected: true,
      isInstitutionSelected: false,
      isImagesSelected: false,
      templateId: null,
      isStudyDescriptionSelected: false,
    }));
  }, []);

  useEffect(() => {
    retrievePatientDetails();
    retrieveUserSignature();
  }, []);

  useEffect(() => {
    if (selectedItem?.templateId) {
      retrieveTemplateData();
    }
  }, [selectedItem?.templateId]);

  const retrieveTemplateData = async () => {
    await fetchTemplate({ id: selectedItem?.templateId })
      .then((res) => {
        setEditorData(res.data.data.report_data);
      })
      .catch((err) => console.log(err));
  };

  const retrieveUserSignature = async () => {
    setIsLoading(true);
    await fetchUserSignature({ id: user_id })
      .then((res) => {
        setUsername(res?.data?.data?.user__username);
        setSignatureImage(res?.data?.data?.signature_image);
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
    setIsLoading(false);
  };

  const retrievePatientDetails = async () => {
    setIsLoading(true);
    await getMoreDetails({ id })
      .then((res) => {
        const resData = {
          ...res.data.data,
          patient_id: res.data.data?.Patient_id,
          patient_name: res.data?.data?.Patient_name,
          gender: res.data?.data?.Gender,
          dob: res.data?.data?.DOB,
          accession_number: res.data?.data?.Accession_number,
          modality: res.data.data?.Modality,
          mainTags:
            res.data.data?.information?.study__study_metadata?.MainDicomTags,
          images: res.data.data?.information?.study_data?.images,
          institution_name: res.data.data?.institution?.Institution_name,
        };
        setCardDetails(resData);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const retrieveDicomImages = () => {};

  const convertPatientDataToTable = () => {
    const data =
      selectedItem.isPatientSelected && !isPatientInformationInserted
        ? `<div>
        <h2>Patient Information</h2>
        <table>
          <tbody>
            <tr>
              <td>Patient ID</td>
              <td>${cardDetails?.patient_id}</td>
            </tr>
            <tr>
              <td>Patient Name</td>
              <td>${cardDetails?.patient_name}</td>
            </tr>
            <tr>
              <td>Patient Sex</td>
              <td>${cardDetails?.gender}</td>
            </tr>
            <tr>
              <td>Patient Birth Date</td>
              <td>${cardDetails?.dob}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>${cardDetails?.Age}</td>
            </tr>
            <tr>
              <td>Accession Number</td>
              <td>${cardDetails?.accession_number}</td>
            </tr>
            <tr>
              <td>Modality</td>
              <td>${cardDetails?.Modality}</td>
            </tr>
            <tr>
              <td>Patient Comment</td>
              <td>${cardDetails?.Patient_comments}</td>
            </tr>
          </tbody>
        </table>
      </div>`
        : selectedItem.isInstitutionSelected &&
          !isInstitutionInformationInserted
        ? `<div>
      <h2>Institution Information</h2>
      <table>
        <tbody>
          <tr>
            <td>Institution Name</td>
            <td>${cardDetails?.institution_name}</td>
          </tr>
          <tr>
            <td>Institution Address</td>
            <td>${cardDetails?.institution?.Institution_address}</td>
          </tr>
          <tr>
            <td>Institution City</td>
            <td>${cardDetails?.institution?.Institution_city}</td>
          </tr>
          <tr>
            <td>Institution Contact</td>
            <td>${cardDetails?.institution?.Institution_contact}</td>
          </tr>
          <tr>
            <td>Institution Email</td>
            <td>${cardDetails?.institution?.Institution_email}</td>
          </tr>
        </tbody>
      </table>
    </div>`
        : selectedItem.isImagesSelected
        ? `<figure class="image"><img src=${imageSlider[studyImageID]?.url} alt="study image" style="width:400px;height:300px"></figure>
    `
        : selectedItem.isStudyDescriptionSelected && !isStudyDescriptionInserted
        ? `<div>
        <h2>Study Description</h2>
        <p>${cardDetails?.Study_description}</p>
        </div>`
        : "";
    setEditorData((prev) =>
      selectedItem.isPatientSelected || selectedItem.isInstitutionSelected
        ? `${data}${prev}`
        : `${prev}${data}`
    );
    selectedItem.isPatientSelected && setIsPatientInformationInserted(true);
    selectedItem.isInstitutionSelected &&
      setIsInstitutionInformationInserted(true);
    selectedItem.isStudyDescriptionSelected &&
      setIsStudyDescriptionInserted(true);
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

  const handleReportSave = async () => {
    setIsLoading(true);
    await saveAdvancedFileReport({
      id,
      report: `${editorData} ${`<p style="text-align: right;"><img src=${signatureImage} alt="signature image" style="width:100px;height:80px;text-align: right;"></p>`} ${`<p style="text-align: right;">${username}</p>`}`,
      report_study_description: "Advance",
    })
      .then((res) => {
        NotificationMessage("success", "Advanced Report Saved Successfully");
        navigate(-1);
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <Card
          style={{ minHeight: "calc(100vh - 200px)" }}
          className="report-card"
        >
          <Spin spinning={isLoading}>
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
                          <Typography>{cardDetails?.patient_id}</Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Patient Name:
                          </Typography>
                          <Typography>{cardDetails?.patient_name}</Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Gender:
                          </Typography>
                          <Typography>{cardDetails?.gender}</Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Date of Birth:
                          </Typography>
                          <Typography>{cardDetails?.dob}</Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Age:
                          </Typography>
                          <Typography>{cardDetails?.Age}</Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Accession Number:
                          </Typography>
                          <Typography>
                            {cardDetails?.accession_number}
                          </Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Modality:
                          </Typography>
                          <Typography>{cardDetails?.Modality}</Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Patient Comment:
                          </Typography>
                          <Typography>
                            {cardDetails?.Patient_comments}
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
                          <Typography>
                            {cardDetails?.institution_name}
                          </Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Institution Address:
                          </Typography>
                          <Typography>
                            {cardDetails?.institution?.Institution_address}
                          </Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Institution City:
                          </Typography>
                          <Typography>
                            {cardDetails?.institution?.Institution_city}
                          </Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Institution Contact:
                          </Typography>
                          <Typography>
                            {cardDetails?.institution?.Institution_contact}
                          </Typography>
                        </div>
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Institution Email:
                          </Typography>
                          <Typography>
                            {cardDetails?.institution?.Institution_email}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedItem?.isStudyDescriptionSelected && (
                    <>
                      <Typography className="card-heading">
                        Study Description
                      </Typography>
                      <div>
                        <Divider />
                        <div className="report-main-div">
                          <Typography className="report-text-primary">
                            Study Description:
                          </Typography>
                          <Typography>
                            {cardDetails?.Study_description}
                          </Typography>
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
          </Spin>
        </Card>
        <div
          style={{
            display: "flex",
            marginTop: "10px",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="primary" onClick={() => handleReportSave()}>
            File Report
          </Button>
        </div>
      </div>
      {/* <div>
        <h3>Editor Output:</h3>
        <div dangerouslySetInnerHTML={{ __html: editorData }} />
      </div> */}
    </>
  );
};

export default Editor;
