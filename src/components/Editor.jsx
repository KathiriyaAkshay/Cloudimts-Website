import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useContext, useEffect, useState } from 'react'
import '../../ckeditor5/build/ckeditor'
import { Button, Card, Col, Divider, Row, Spin, Typography, Input, Select, Form } from 'antd'
import {
  fetchTemplate,
  fetchUserSignature,
  saveAdvancedFileReport
} from '../apis/studiesApi'
import { ReportDataContext } from '../hooks/reportDataContext'
import { filterDataContext } from '../hooks/filterDataContext'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import NotificationMessage from './NotificationMessage'
import { useNavigate } from 'react-router-dom'
import APIHandler from '../apis/apiHandler'
import { descriptionOptions } from '../helpers/utils'

const Editor = ({ id }) => {

  const [editorData, setEditorData] = useState('')
  const [cardDetails, setCardDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { selectedItem, setSelectedItem, docFiledata } = useContext(ReportDataContext)
  const { templateOption, setTemplateOption, setTemplateInstitutionOption } = useContext(filterDataContext)
  const [studyImageID, setStudyImageID] = useState(0)
  const [signatureImage, setSignatureImage] = useState(null)
  const [username, setUsername] = useState('')
  const user_id = localStorage.getItem('userID')
  const navigate = useNavigate();

  const [institutionReport, setInstitutionReport] = useState({});
  const [referenceImageCount, setReferenceImageCount] = useState(1);
  const [seriesId, setSeriesId] = useState(null);

  const [form] = Form.useForm();
  const [reportStudyDescription, setReportStudyDescription] = useState(null);

  // **** StudyUID information **** // 
  const studyUIDInformation = `https://viewer.cloudimts.com/ohif/viewer?url=../studies/` + localStorage.getItem("studyUIDValue") + "/ohif-dicom-json";

  useEffect(() => {
    setSelectedItem(prev => ({
      isPatientSelected: true,
      isInstitutionSelected: false,
      isImagesSelected: false,
      isOhifViewerSelected: false,
      templateId: null,
      isStudyDescriptionSelected: false
    }))
  }, [])

  // **** Reterive user signature related information **** // 
  const retrieveUserSignature = async () => {
    setIsLoading(true)

    await fetchUserSignature({ id: user_id })
      .then(res => {
        if (res.data.status) {
          setUsername(res?.data?.data?.user__username)
          setSignatureImage(res?.data?.data?.signature_image)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', err.response.data.message))

    setIsLoading(false)
  }

  // **** Reterive patient details related information **** // 
  const retrievePatientDetails = async () => {
    setIsLoading(true)

    let studyRequestPaylod = { id: id }

    let responseData = await APIHandler(
      'POST',
      studyRequestPaylod,
      'studies/v1/fetch_particular_study'
    )

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed');

    } else if (responseData['status'] === true) {

      setTemplateOption(responseData['data']['Modality']);

      let Institution_id = responseData['data']['institution_id']
      let SeriesIdValue = responseData['data']['series_id']

      setSeriesId(SeriesIdValue);
      setTemplateInstitutionOption(responseData?.data?.institution_id);

      setCardDetails({ "Study_description": responseData['data']?.Study_description })

      // **** Retervice institution report details information **** // 

      let institutionReportPayload = {
        institution_id: Institution_id,
        study_id: id
      };

      let reportResponseData = await APIHandler(
        'POST',
        institutionReportPayload,
        'institute/v1/institution-report-details'
      )
      if (reportResponseData['status'] === true) {
        let tempData = reportResponseData?.data ;
        let tempPatientId = tempData?.patient_details['Patient id'] ;
        let tempPatientName = tempData?.patient_details['Patient name'] ; 
        
        delete tempData?.patient_details['Patient id']
        delete tempData?.patient_details['Patient name'] ; 
        
        setInstitutionReport({ ...reportResponseData['data'] })
        convertedPatientTableInitially({"patient_details": {...{"Patient id": tempPatientId, "Patient name": tempPatientName}, ...tempData?.patient_details}, "institution_details": {...tempData?.institution_details}})
      }
    }
  }

  // **** Reterive particular user study image *** // 
  const FetchStudyImage = async () => {
    let requestPayload = {
      series_id: seriesId
    }

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'studies/v1/studies_images'
    )

    let ServerURL = import.meta.env.VITE_APP_BE_ENDPOINT

    if (responseData === false) {
      // NotificationMessage('warning', 'Network request failed')
    } else if (responseData['status'] === true) {
      let temp = []

      responseData['data'].map(element => {
        temp.push({
          url: `${ServerURL}studies/v1/fetch_instance_image/${element}`
        })
      })
      setImageSlider([...temp])
    }
  }

  useEffect(() => {
    retrievePatientDetails()
    retrieveUserSignature()
  }, [])

  // **** Reterive particular template related information **** // 
  const retrieveTemplateData = async () => {
    await fetchTemplate({ id: selectedItem?.templateId })
      .then(res => {
        if (res.data.status) {
          setEditorData(res.data.data.report_data)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Network request failed',
          err.response.data.message
        )
      )
  }

  useEffect(() => {
    if (selectedItem?.templateId) {
      retrieveTemplateData()
    }
  }, [selectedItem?.templateId])


  useEffect(() => {
    if (seriesId !== null) {
      FetchStudyImage()
    }
  }, [seriesId])

  useEffect(() => {
    convertPatientDataToTable();
  }, [selectedItem])


  const convertPatientDataToTable = (insertImage) => {
    const data =
      selectedItem.isInstitutionSelected
        ? `<div>
          
        <h2 style = "text-align: center;">Institution Information</h2>
        <table>
          <tbody>
            ${institutionReport.hasOwnProperty('institution_details') &&
        Object.entries(institutionReport?.institution_details)
          .map(([key, value]) => {
            return `
                  <tr>
                    <th>${key}</th>
                    <td>${value}</td>
                  </tr>
                `
          })
          .join('')
        }
                </tbody>
        </table>
      </div>`
        : selectedItem.isImagesSelected && insertImage
          ? `
          <h3 style = "text-align:center;">Reference image ${referenceImageCount}</h3>
          <figure class="image">
          <img src="${imageSlider[studyImageID]?.url}" alt="study image" style="width: 256px; height: 200px;" class="Reference-image">
          </figure>`
          : selectedItem.isStudyDescriptionSelected
            ? `<div>
        <h3 style = "text-align:center;">Study Description</h3>
        <p style = "text-align: center ; ">${cardDetails?.Study_description}</p>
        </div>`
            : selectedItem.isOhifViewerSelected
              ? `<div></div>`
              : ``

    setEditorData(prev =>
      selectedItem.isPatientSelected || selectedItem.isInstitutionSelected
        ? `${data}${prev}`
        : `${prev}${data}`
    )

    selectedItem.isImagesSelected && setReferenceImageCount(prev => prev + 1)
  }

  const [imageSlider, setImageSlider] = useState([])

  const convertedPatientTableInitially = (institutionReport) => {
    institutionReport.patient_details = Object.assign(institutionReport.patient_details)
    const keys = Object.keys(institutionReport?.institution_details);
    var temp = ``;
    const data = `<div>

    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        ${institutionReport.hasOwnProperty('patient_details') && selectedItem.isPatientSelected ?
        Object.entries(institutionReport?.patient_details)
          .map(([key, value], index) => {
            temp = `
            <tr>
              <td style="text-align: left; padding: 8px;font-weight:600">${key}</td>
              <td style="padding: 8px;">${value}</td>`;

            if (index < keys.length) {
              temp +=
                `<td style="text-align: left; padding: 8px;font-weight:600  ">${keys[index]}</td>
              <td style="padding: 8px;">${institutionReport.institution_details[keys[index]]}</td></tr>`;
            } else {
              temp += `</tr>`
            }

            return temp;

          })
          .join('')
        : ''}


      </tbody>
    </table>
  </div>`
    setEditorData(prev =>
      `${prev}${data}`
    )
  }

  // **** Submit report handler **** // 
  const handleReportSave = async () => {

    if (reportStudyDescription == null) {

      NotificationMessage("warning", "Please, Select report study description")

    } else {

      setIsLoading(true);
      await saveAdvancedFileReport({
        id,
        report: `${editorData} ${`<p style="text-align: right;"><img src=${signatureImage} alt="signature image" style="width:100px;height:80px;text-align: right;"></p>`} ${`<p style="text-align: right;">${username}</p>`}`,
        report_study_description: reportStudyDescription
      })
        .then(res => {
          if (res.data.status) {
            navigate(-1)
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err => NotificationMessage('warning', err.response.data.message))
      setIsLoading(false)
    }


  }

  const StudyDescriptionChangeHandler = (selectionOption) => {
    setReportStudyDescription(selectionOption);
  }

  useEffect(() => {
    setEditorData(prev => prev + docFiledata)
  }, [docFiledata])


  const scrollToBottom = () => {
    var scrollingDiv = document.getElementById("scrollingDiv");
    scrollingDiv.scrollTop = scrollingDiv.scrollHeight;
  }

  return (
    <>
      <div>
        <Card
          style={{ minHeight: 'calc(100vh - 200px)' }}
          className='report-card'
        >
          <Spin spinning={isLoading}>
            <Row gutter={30}>
              <Col xs={24} sm={12} md={selectedItem.isOhifViewerSelected ? 9 : selectedItem.isImagesSelected ? 7 : 0}>
                <div className='report-details-div'>

                  {selectedItem?.isImagesSelected && imageSlider.length > 0 && (
                    <>
                      <Typography className='card-heading'>
                        Study Images
                      </Typography>
                      <Divider />

                      <div className='menu-image-slider'>
                        {imageSlider.length > 0 && (
                          <Slider
                            dots={false}
                            className='slider'
                            slidesToShow={1}
                            slidesToScroll={1}
                            infinite={false}
                            afterChange={prev => setStudyImageID(prev)}
                          >
                            {imageSlider.length > 0 &&
                              imageSlider.map(image => (
                                <img
                                  src={image.url}
                                  alt='image'
                                  className='slider-image'
                                  loading='lazy'
                                />
                              ))}
                          </Slider>
                        )}
                      </div>
                    </>
                  )}

                  {/* ==== Show OHIF Viewer information ====  */}

                  {selectedItem?.isOhifViewerSelected && (
                    <>
                      <div style={{ width: "100%", height: "100%", overflowY: "auto" }} onBeforeInput={scrollToBottom}>
                        <iframe src={studyUIDInformation} width="100%" height="800px" className='ohif-container'></iframe>

                      </div>
                    </>
                  )}

                  {!selectedItem?.isOhifViewerSelected && (
                    <>
                      <div className='btn-div insert-report-details-option'>
                        <Button type='primary' onClick={() => convertPatientDataToTable(true)}>
                          Insert
                        </Button>
                      </div>

                    </>
                  )}
                </div>
              </Col>

              <Col xs={24} sm={12} md={selectedItem.isOhifViewerSelected ? 15 : selectedItem.isImagesSelected ? 17 : 24}
                className='report-editor-div'>

                <Form
                  labelCol={{
                    span: 4,
                    // offset:3,
                  }}
                  wrapperCol={{
                    span: 20,
                  }}
                  labelAlign="left"
                  form={form}
                  className='Advance-report-study-description-selection'
                >
                  <Form.Item
                    name="study_description"
                    label="Modality Study Description"
                    className="category-select"

                    rules={[
                      {
                        required: true,
                        message: "Please select Modality Study Description",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Study Description"
                      options={descriptionOptions}
                      showSearch
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      onChange={StudyDescriptionChangeHandler}
                    />
                  </Form.Item>
                </Form>

                <div className='advance-report-file-option-editor'>
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      setEditorData(data)
                    }}
                  />
                </div>

              </Col>

            </Row>

          </Spin>

        </Card>

        <div
          style={{
            display: 'flex',
            marginTop: '10px',
            justifyContent: 'flex-end',
            gap: '10px'
          }}
        >
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type='primary' onClick={() => handleReportSave()}>
            File Report
          </Button>
        </div>
      </div>
    </>
  )
}

export default Editor
