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
  const { selectedItem, setSelectedItem } = useContext(ReportDataContext)
  const [studyImageID, setStudyImageID] = useState(0)
  const [signatureImage, setSignatureImage] = useState(null)
  const [username, setUsername] = useState('')
  const user_id = localStorage.getItem('userID')
  const navigate = useNavigate()
  const [isPatientInformationInserted, setIsPatientInformationInserted] =
    useState(false)
  const [
    isInstitutionInformationInserted,
    setIsInstitutionInformationInserted
  ] = useState(false)
  const [isStudyDescriptionInserted, setIsStudyDescriptionInserted] =
    useState(false)

  const [institutionReport, setInstitutionReport] = useState({}) ; 
  const [referenceImageCount, setReferenceImageCount] = useState(1) ; 
  const [seriesId, setSeriesId] = useState(null) ; 

  const [form] = Form.useForm() ; 
  const [reportStudyDescription, setReportStudyDescription] = useState(null) ; 

  useEffect(() => {
    setSelectedItem(prev => ({
      isPatientSelected: true,
      isInstitutionSelected: false,
      isImagesSelected: false,
      templateId: null,
      isStudyDescriptionSelected: false
    }))
  }, [])

  useEffect(() => {
    retrievePatientDetails()
    retrieveUserSignature()
  }, [])

  useEffect(() => {
    if (selectedItem?.templateId) {
      setIsPatientInformationInserted(false) ; 
      setIsInstitutionInformationInserted(false) ; 
      setIsStudyDescriptionInserted(false) ; 
      retrieveTemplateData()
    }
  }, [selectedItem?.templateId])

  // ==== Fetch All templates names list

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

  // ==== Fetch radiologist signature information

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

  // ==== Fetch Patient details informatioin

  const retrievePatientDetails = async () => {
    setIsLoading(true)

    let studyRequestPaylod = { id: id }

    let responseData = await APIHandler(
      'POST',
      studyRequestPaylod,
      'studies/v1/fetch_particular_study'
    )

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed') ; 

    } else if (responseData['status'] === true) {
      
      let Institution_id = responseData['data']['institution_id']
      let SeriesIdValue = responseData['data']['series_id']

      setSeriesId(SeriesIdValue) ; 

      let institutionReportPayload = {
        institution_id: Institution_id,
        study_id: id
      } ; 

      setCardDetails({"Study_description": responseData['data']?.Study_description})

      let reportResponseData = await APIHandler(
        'POST',
        institutionReportPayload,
        'institute/v1/institution-report-details'
      )
      if (reportResponseData['status'] === true) {
        setInstitutionReport({ ...reportResponseData['data'] })
      }
    }
  }

  // ==== Fetch Study images

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
      NotificationMessage('warning', 'Network request failed')
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
    if (seriesId !== null) {
      FetchStudyImage()
    }
  }, [seriesId])

  const convertPatientDataToTable = () => {
    const data =
      selectedItem.isPatientSelected && !isPatientInformationInserted
        ? `<div>
        <h2 style = "text-align: center; ">Patient Information</h2>
        <table>
          <tbody>
            ${
              institutionReport.hasOwnProperty('patient_details') &&
              Object.entries(institutionReport?.patient_details)
                .map(([key, value]) => {
                  return `
                <tr>
                  <td>${key}</td>
                  <td>${value}</td>
                </tr>
              `
                })
                .join('')
            }
          </tbody>
        </table>
        </div>`
        : selectedItem.isInstitutionSelected &&
          !isInstitutionInformationInserted
        ? `<div>
              <h2 style = "text-align: center;">Institution Information</h2>
              <table>
                <tbody>
                  ${
                    institutionReport.hasOwnProperty('institution_details') &&
                    Object.entries(institutionReport?.institution_details)
                      .map(([key, value]) => {
                        return `
                  <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                  </tr>
                `
                      })
                      .join('')
                  }
                </tbody>
        </table>
      </div>`
        : selectedItem.isImagesSelected
        ? `
          <h3 style = "text-align:center;">Reference image ${referenceImageCount}</h3>
          <figure class="image">
          <img src="${imageSlider[studyImageID]?.url}" alt="study image" style="width: 256px; height: 200px;" class="Reference-image">
          </figure>`
        : selectedItem.isStudyDescriptionSelected && !isStudyDescriptionInserted
        ? `<div>
        <h3 style = "text-align:center;">Study Description</h3>
        <p style = "text-align: center ; ">${cardDetails?.Study_description}</p>
        </div>`
        : ''

    setEditorData(prev =>
      selectedItem.isPatientSelected || selectedItem.isInstitutionSelected
        ? `${data}${prev}`
        : `${prev}${data}`
    )

    selectedItem.isPatientSelected && setIsPatientInformationInserted(true)
    selectedItem.isInstitutionSelected &&
      setIsInstitutionInformationInserted(true)
    selectedItem.isStudyDescriptionSelected &&
      setIsStudyDescriptionInserted(true)
    selectedItem.isImagesSelected && setReferenceImageCount(prev => prev + 1)
  }

  const [imageSlider, setImageSlider] = useState([])

  const handleReportSave = async () => {
    
    if (reportStudyDescription == null){
      
      NotificationMessage("warning", "Please, Select report study description")
      
    } else {
      
      setIsLoading(true) ; 
      await saveAdvancedFileReport({
        id,
        report: `${editorData} ${`<p style="text-align: right;"><img src=${signatureImage} alt="signature image" style="width:100px;height:80px;text-align: right;"></p>`} ${`<p style="text-align: right;">${username}</p>`}`,
        report_study_description: reportStudyDescription
      })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', 'Your report submit successfully')
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

  const StudyDescriptionChangeHandler  = (selectionOption) => {
    setReportStudyDescription(selectionOption) ; 
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
              <Col xs={24} sm={12} md={12}>
                <div className='report-details-div'>

                  {/* ==== Show Patient details ====  */}

                  {selectedItem?.isPatientSelected && (
                    <>
                      <Typography className='card-heading'>
                        Patient Information
                      </Typography>
                      <table className='Report-info-table'>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          {institutionReport.hasOwnProperty(
                            'patient_details'
                          ) &&
                            Object.entries(
                              institutionReport?.patient_details
                            ).map(([key, value]) => (
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
                      <Typography className='card-heading'>
                        Institution Information
                      </Typography>
                      <div>
                        <table className='Report-info-table'>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Information</th>
                            </tr>
                          </thead>
                          <tbody>
                            {institutionReport.hasOwnProperty(
                              'institution_details'
                            ) &&
                              Object.entries(
                                institutionReport?.institution_details
                              ).map(([key, value]) => (
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
                      <Typography className='card-heading'>
                        Study Description
                      </Typography>
                      <div>
                        <Divider />
                        <div className='report-main-div'>
                          <Typography className='report-text-primary'>
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

                  <div className='btn-div insert-report-details-option'>
                    <Button type='primary' onClick={convertPatientDataToTable}>
                      Insert
                    </Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={12} className='report-editor-div'>

                <Form
                  labelCol={{
                    span: 24,
                    // offset:3,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  labelAlign="right"
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

                <CKEditor
                  editor={ClassicEditor}
                  data={editorData}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setEditorData(data)
                  }}
                />

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
