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
import APIHandler from "../apis/apiHandler";

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
  const [institutionReport, setInstitutionReport] = useState({}) ; 

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

  // ==== Fetch All templates names list 

  const retrieveTemplateData = async () => {
    await fetchTemplate({ id: selectedItem?.templateId })
      .then((res) => {
        setEditorData(res.data.data.report_data);
      })
      .catch((err) => console.log(err));
  };

  // ==== Fetch radiologist signature information  

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

  // ==== Fetch Patient details informatioin 

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
      });

    let studyRequestPaylod = {"id": id} ; 
    
    let responseData = await APIHandler("POST", studyRequestPaylod, "studies/v1/fetch_particular_study") ; 

    if (responseData === false){
      NotificationMessage("warning", "Network request failed") ; 
    
    } else if (responseData['status'] === true){

      let Institution_id = responseData['data']['institution_id'] ; 

      let institutionReportPayload = {
        "institution_id": Institution_id, 
        "study_id": id 
      } ; 

      let reportResponseData = await APIHandler("POST", institutionReportPayload, 'institute/v1/institution-report-details') ; 

      console.log(reportResponseData);

      if (reportResponseData['status'] === true){
        setInstitutionReport({...reportResponseData['data']}) ; 
      }
    }
  
  };

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
        ? `<figure class="image"><img src=${imageSlider[studyImageID]?.url} alt="study image" style="width:256px;height:200px"></figure>
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
                  
                  {/* ==== Show Patient details ====  */}

                  {selectedItem?.isPatientSelected && (
                    <>
                      <Typography className="card-heading">
                        Patient Information
                      </Typography>

                        <table className="Report-info-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Information</th>
                            </tr>
                          </thead>
                          <tbody>

                            {institutionReport.hasOwnProperty("patient_details") && Object.entries(institutionReport?.patient_details).map(([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    </>
                  )}

                  {/* ==== Show Institution details ====  */}
                  
                  {selectedItem?.isInstitutionSelected && (
                    <>
                      <Typography className="card-heading">
                        Institution Information
                      </Typography>
                      <div>

                      <table className="Report-info-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                              <th>Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          {institutionReport.hasOwnProperty("institution_details") && Object.entries(institutionReport?.institution_details).map(([key, value]) => (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                    </div>
                    </>
                  )}

                  {/* ==== Show Study description ====  */}
                  
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

                  {/* ==== Show Image slider information ====  */}
                  
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

                  <div className="btn-div insert-report-details-option">
                    <Button type="primary" onClick={convertPatientDataToTable}>
                      Insert
                    </Button>
                  </div>
                </div>
              
              </Col>

              <Col xs={24} sm={12} md={12} className="report-editor-div">
                <CKEditor
                  editor={ClassicEditor}
                  data={editorData}
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
    </>
  );
};

export default Editor;
