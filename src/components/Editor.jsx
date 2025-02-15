const OHIF_VIEWER = import.meta.env.VITE_APP_OHIF_VIEWER ; 

import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import '../../ckeditor5/build/ckeditor'
import { Button, Card, Col, Row, Spin, Typography, Input, Select, Form, Divider, Space, Tooltip, Modal, Drawer, Table, Flex, Image } from 'antd'
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
import { descriptionOptions, EmailHeaderContent, ReportDesclamierContent } from '../helpers/utils'
import { CloseCircleOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { convertToDDMMYYYY } from '../helpers/utils'
import { Splitter } from 'antd'
import { BsEyeFill } from 'react-icons/bs' ; 
import { getStudyModalityList, getStudyDescriptionList } from '../apis/studiesApi';
import { createStudyModality, createStudyDescription } from '../apis/studiesApi';

const Editor = ({ id }) => {
  const navigate = useNavigate();
  const user_id = localStorage.getItem('userID')
  const [form] = Form.useForm();

  const [editorData, setEditorData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { selectedItem, setSelectedItem, docFiledata } = useContext(ReportDataContext)
  const { setTemplateOption,
    patientInforamtionDrawer,
    setPatientInformationDrawer,
    setIsManualStudy,
    isManualStudy
  } = useContext(filterDataContext)
  const [studyImageID, setStudyImageID] = useState(0);
  const [signatureImage, setSignatureImage] = useState(null)
  const [username, setUsername] = useState('')

  const [seriesId, setSeriesId] = useState(null);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  const [convertTableInformation, setConvertTableInformation] = useState(undefined);
  const [partientInfoDrawerOption, setPatientInfoDrawerOption] = useState("info");

  const [reportStudyDescription, setReportStudyDescription] = useState(null);
  const [studyDescriptionLoading, setStudyDescriptionLoading] = useState(false) ; 
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const [institutionId, setInstitutionId] = useState(undefined);
  const [genderId, setGenderId] = useState(undefined);
  const [patientInformation, setPatientInformation] = useState(undefined);
  const [patientReportList, setPatientReportList] = useState([]);
  const [isTableCreate, setIsTableCreate] = useState(false);
  const [tableHtmlData, setTableHtmlData] = useState(undefined) ; 
  const [templateOption, setTemplateOptions] = useState([]);
  const [assignStudyDataImage, setAssignStudyDataImage] = useState([]) ; 
  const [assignStudyDataDocument, setAssignStudyDataDocument] = useState([]) ; 

  const [manualStudyImages, setManualStudyImages] = useState([]);
  const [manualStudyLoading, setManualStudyLoading] = useState(false);

  // Reterive template option list
  const retrieveTemplateOptions = async () => {

    let report_modality = localStorage.getItem("report-modality");
    let requestPayload = {
      "page_number": 1,
      "page_limit": 200,
      "modality": report_modality,
      "institution": institutionId,
      "radiologist": parseInt(localStorage.getItem("userID"))
    };

    if (genderId !== null && genderId !== undefined) {
      requestPayload['gender'] = genderId;
    }
    let responseData = await APIHandler("POST", requestPayload, "report/v1/submitReportlist")

    if (responseData === false) {
    } else if (responseData?.status === true) {

      const resData = responseData?.data.map((data) => ({
        label: data?.name,
        value: data?.id, 
        ...data
      }))

      setTemplateOptions([...resData]);
      let temp = selectedItem;
      setSelectedItem({ ...temp, templateId: resData[0]?.value })

    } else {
    }

  }

  useEffect(() => {
    if (institutionId !== undefined) {
      retrieveTemplateOptions();
    }
  }, [institutionId, genderId]);

  // Reterive user signature 
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

  // Generate Report table related information 
  const convertedPatientTableInitially = (institutionReport, isReturn) => {
    setIsTableCreate(false);
    const data = `<div>
      <table style="width: 100%; border-collapse: collapse;">
          <tbody>
              ${(() => {
                  if (!institutionReport) {
                      return ''; 
                  }

                  const leftData = [...institutionReport?.left];
                  const rightData = [...institutionReport?.right];
                  const maxLength = Math.max(leftData?.length, rightData?.length);

                  const generateTableRow = (leftColumn, rightColumn) => {
                      let newRow = '<tr>';
                      newRow += `
                          <td style="text-align: left; padding: 8px; font-weight:600">${leftColumn?.column_name || ''}</td>
                          <td style="padding: 8px;">${leftColumn?.column_value || ''}</td>
                          <td style="text-align: left; padding: 8px; font-weight:600">${rightColumn?.column_name || ''}</td>
                          <td style="padding: 8px;">${rightColumn?.column_value || ''}</td>
                      `;
                      newRow += '</tr>';
                      return newRow;
                  };

                  return Array.from({ length: maxLength }).fill(0).map((_, index) => {
                      const leftColumn = leftData[index];
                      const rightColumn = rightData[index];
                      return generateTableRow(leftColumn, rightColumn);
                  });
              })()}
          </tbody>
      </table>
    </div>`;
    setIsTableCreate(true);
    setTableHtmlData(data) ; 
    if (isReturn == true) {
      return data;
    } else {
      setEditorData(prev => `${prev}${data}`);
    }
  };

  // Reterive patient details and institution report details information 
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

      let findElement = items?.filter((element) => String(element?.value).toLowerCase() == String(responseData?.data?.Study_description).toLowerCase()) ; 
      if (findElement?.length == 0){
        setName(responseData?.data?.Study_description)
        addItem() ; 
      }

      // Set study description 
      form.setFieldsValue({
        "study_description": responseData?.data?.Study_description
      })

      setReportStudyDescription(responseData?.data?.Study_description || undefined);
      setPatientInformation(responseData?.data);
      setPatientReportList(responseData?.report || []);

      localStorage.setItem("report-modality", responseData?.data?.Modality);
      setTemplateOption(responseData?.data?.Modality);
      setIsManualStudy(responseData?.data?.manual_upload)

      let Institution_id = responseData['data']['institution_id']
      let SeriesIdValue = responseData['data']['series_id']

      setSeriesId(SeriesIdValue);
      setInstitutionId(responseData?.data?.institution_id);
      setGenderId(responseData?.data?.Gender);

      try {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
        const imageUrls = responseData?.data?.assigned_study_data?.study_data?.images.filter(url => {
          const extension = url.split('.').pop().toLowerCase(); 
          return imageExtensions.includes(extension); 
        });
  
        const nonImageUrls = responseData?.data?.assigned_study_data?.study_data?.images.filter(url => {
          const extension = url.split('.').pop().toLowerCase(); 
          return !imageExtensions.includes(extension); 
        });
        setAssignStudyDataImage(imageUrls) ; 
        setAssignStudyDataDocument(nonImageUrls) ; 
      } catch (error) {
        
      }

      // Institution report details fetch ======================================
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
        setConvertTableInformation({ "left": [ ...reportResponseData?.data?.left ], "right": [ ...reportResponseData?.data?.right ] })
        convertedPatientTableInitially({ "left": [ ...reportResponseData?.data?.left ], "right": [ ...reportResponseData?.data?.right ] }, undefined)
      }
    }
  }

  // Reterive particular user images 
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

  // Reterive particular template information 
  const retrieveTemplateData = async () => {
    try {
      const res = await fetchTemplate({ id: selectedItem?.templateId });

      if (res?.data?.status) {
        setEditorData(tableHtmlData + res?.data?.data?.report_data) ; 
        // setEditorData(prevData => prevData + (res?.data?.data?.report_data || ""));
      } else {
        NotificationMessage('warning', 'Network request failed', res?.data?.message || "Unknown error occurred");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "An unexpected error occurred";
      NotificationMessage('warning', 'Network request failed', errorMessage);
    }
  };

  // Fetch manual study related 
  const SeriesImagesFetchHandler = async () => {
    setManualStudyLoading(true);
    let responseData = await APIHandler("POST", { id: id }, "studies/v1/fetch_series_image");
    setManualStudyLoading(false);
    if (responseData === false) {
      NotificationMessage("warning", "Network request failed");
    } else if (responseData?.status) {
      setManualStudyImages([...responseData?.data]);
    } else {
      NotificationMessage("warning", responseData?.message);
    }

  }

  useEffect(() => {
    retrievePatientDetails()
    retrieveUserSignature()
  }, [])

  useEffect(() => {
    if (seriesId !== null
      && seriesId !== undefined
      && isManualStudy == false
    ) {
      FetchStudyImage()
    }
  }, [seriesId, isManualStudy])

  useEffect(() => {
    if (selectedItem?.templateId && isTableCreate) {
      retrieveTemplateData()
    }
  }, [selectedItem?.templateId, isTableCreate]);

  useEffect(() => {
    if (isManualStudy) {
      SeriesImagesFetchHandler();
    }
  }, [isManualStudy])

  // useEffect(() => {
  //   convertPatientDataToTable();
  // }, [selectedItem])

  useEffect(() => {
    if (selectedItem?.showPreview == true) {
      setIsReportPreviewOpen(true);
    }
  }, [selectedItem?.showPreview]);



  // Word file load related option handler =================================
  useEffect(() => {
    if (docFiledata !== "" && docFiledata !== undefined && convertTableInformation != undefined) {
      let data = convertedPatientTableInitially(convertTableInformation, true);
      setEditorData(data + docFiledata)
    }
  }, [docFiledata, convertTableInformation])


  const columns = [
    {
      title: 'Report Time',
      dataIndex: 'reporting_time',
      render: (text, record) => convertToDDMMYYYY(record?.reporting_time)
    },
    {
      title: 'Study Description',
      dataIndex: 'study_description'
    },
    {
      title: "Action",
      render: (text, record) => (
        <Space>

          {/* View report option  */}
          <Tooltip title="View">
            <BsEyeFill
              className='action-icon'
              onClick={() => {
                if (record?.report_type === "Advanced report") {
                  window.open(`/reports/${record?.id}/view`, '_blank');
                }
              }}
            />
          </Tooltip>

          {/* Download report option  */}
          <Tooltip title="Download">
            <DownloadOutlined
              className='action-icon'
              onClick={async () => {
                console.log(record);
                let responseData = await APIHandler("POST", { id: record?.id }, "studies/v1/report-download");
                if (responseData?.status) {
                  let report_download_url = responseData?.message;
                  let report_patient_name = patientInformation?.Patient_name.replace(/ /g, "-");
                  let updated_report_name = `${patientInformation?.Patiend_id}-${report_patient_name}-report.pdf`;
                  downloadPDF(report_download_url, updated_report_name);
                }
              }}
            />
          </Tooltip>

        </Space>
      )
    }
  ]

  const onNameChange = async (event) => {
    setName(event.target.value);
  };

  const addItem = async (e) => {
    try {
      e.preventDefault();
    } catch (error) {
    }

    if (name !== "" && name !== undefined && name !== null){
      setItems([{ label: name, value: name }, ...items]);
      await InsertStudyDescription({study_description: name}) ; 
      setName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // **** Fetch study description list *** // 
  const FetchStudyDescriptionList = async () => {
    setStudyDescriptionLoading(true) ; 
    await getStudyDescriptionList({})
      .then((res) => {
        let tempOtion = res?.data?.data?.map((element) => {
          return {
            label: element?.study_description, 
            value: element?.study_description
          }
        })
        setItems(tempOtion) ; 
      }).catch((error) => {})
    setStudyDescriptionLoading(false) ; 
  }

  const InsertStudyDescription = async (params) => {
    await createStudyDescription(params)
      .then((res) => {})
      .catch((error) => {})
  }
  useEffect(() => {FetchStudyDescriptionList()}, []) ; 

  // **** StudyUID information **** // 
  const [imageSlider, setImageSlider] = useState([])

  function getFileNameFromURL(url) {
    const pathSegments = url.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const fileName = lastSegment.replace(/[\?|#].*$/, '');
    return fileName;
  }

  // **** Submit report handler **** // 
  const handleReportSave = async () => {
    if (reportStudyDescription == null) {
      NotificationMessage("warning", "Please, Select report study description")
    } else {
      setIsLoading(true);
      await saveAdvancedFileReport({
        id,
        report: `${EmailHeaderContent} 
          ${editorData} 
          <div style="margin-top: 20px; text-align: left;">
            <p>Reported By,</p>
            <img src=${signatureImage} alt="signature image" style="width:200px;height:100px;text-align: left;">
          </div>
          <p style="text-align: left; font-weight: 600; font-size: 16px;">${username}</p>
          ${ReportDesclamierContent}
        `,
        report_study_description: reportStudyDescription
      })
        .then(res => {
          if (res.data.status) {
            NotificationMessage("success", "Study report successfully");
            navigate("/studies");
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch((err) => {
          NotificationMessage('warning', err.response.data.message)
        })
      setIsLoading(false)

    }
  }



  const scrollToBottom = () => {
    var scrollingDiv = document.getElementById("scrollingDiv");
    scrollingDiv.scrollTop = scrollingDiv.scrollHeight;
  }


  // Weasis viewer open handler =============================================================
  const WeasisViewerHandler = (patientId) => {

    const originalString = `$dicom:rs --url "https://viewer.cloudimts.com/dicomweb" -r "patientID=${patientId}"`;
    let encodedString = encodeURIComponent(originalString);
    encodedString = "weasis://" + encodedString;
    window.open(encodedString, "_blank");
  }

  // ********* Download pdf handler ************* // 
  function downloadPDF(pdfUrl, pdfName) {
    var pdfUrl = pdfUrl;

    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('download', pdfName);
    link.setAttribute('href', pdfUrl);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    if (selectedItem?.weasisOption && patientInformation?.Patient_id !== undefined) {
      setSelectedItem(prev => ({
        isPatientSelected: false,
        isInstitutionSelected: false,
        isImagesSelected: false,
        isOhifViewerSelected: false,
        templateId: prev?.templateId,
        isStudyDescriptionSelected: false,
        patientInfo: false,
        weasisOption: false
      }))
      WeasisViewerHandler(patientInformation?.Patient_id);
    }
  }, [selectedItem, patientInformation?.Patient_id])

  useEffect(() => {
    if (String(editorData).includes(",,,") && String(editorData) !== String(editorData).replace(",,,,", '')) {
      let tempEditorData = String(editorData).replace(",,,,", '');
      setEditorData(tempEditorData);
    }
  }, [editorData]);


  return (
    <>

      {/* Editor and Study description related information  */}
      <div>
        <Card
          style={{ minHeight: 'calc(100vh - 140px)' }}
          className='report-card'
        >
          <Spin spinning={isLoading}>
            <Splitter style={{ display: 'flex', width: '100%', height: '100%' }}>

              {(selectedItem?.isImagesSelected ||
                selectedItem?.isOhifViewerSelected ||
                selectedItem?.isManualImageOpen
              ) && (
                  <Splitter.Panel min="20%" max="70%" 
                    defaultSize={
                      selectedItem?.isImagesSelected ?"50%":
                      selectedItem?.isOhifViewerSelected?"50%":"30%"
                    }>

                    <div className='report-details-div'>

                      {/* ===== Study images information drawer ======  */}
                      {selectedItem?.isImagesSelected && imageSlider.length > 0 && (
                        <>
                          <div style={{ display: "flex" }}>
                            <div>
                              <Typography.Title style={{
                                fontSize: "20px",
                                marginTop: 10
                              }}>
                                {String("Study Images").toUpperCase()}
                              </Typography.Title>
                              <div style={{ display: "flex" }}>
                                <div>
                                  {patientInformation?.Patient_name} |
                                </div>
                                <div style={{ marginLeft: 5, color: "red", fontWeight: 600 }}>
                                  {patientInformation?.Modality || "-"}
                                </div>
                              </div>
                            </div>

                            <div style={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto", marginRight: "10px" }}>
                              <Button
                                type='primary'
                                icon={<CloseCircleOutlined />}
                                onClick={() => {
                                  setSelectedItem(prev => ({
                                    isPatientSelected: false,
                                    isInstitutionSelected: false,
                                    isImagesSelected: !prev?.isImagesSelected,
                                    isOhifViewerSelected: false,
                                    templateId: prev?.templateId,
                                    isStudyDescriptionSelected: false
                                  }))
                                }}
                              />
                            </div>

                          </div>

                          <Divider style={{ marginTop: 5 }} />

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
                            <iframe src={`${OHIF_VIEWER}/viewer?StudyInstanceUIDs=${patientInformation?.Study_UID}`} width="100%" height="800px" className='ohif-container' id='ohif-frame'></iframe>
                          </div>
                        </>
                      )}

                      {/* ==== Manual images information layout =====  */}
                      {/* <div>
                        <div style={{ display: "flex" }}>
                          <div>
                            
                            <Typography.Title style={{
                              fontSize: "20px",
                              marginTop: 10
                            }}>
                              {String("Study Images").toUpperCase()} | 
                              <span style={{fontSize: 15, marginTop: "auto", marginBottom:"auto", fontWeight: 600, marginLeft: 5}}>{"Manual Upload"}</span>
                            </Typography.Title>
                            
                            <div style={{ display: "flex" }}>
                              
                              <div>
                                {patientInformation?.Patient_name} |
                              </div>
                              
                              <div style={{ marginLeft: 5, color: "red", fontWeight: 600 }}>
                                {patientInformation?.Modality || "-"}
                              </div>
                            
                            </div>
                          </div>

                          <div style={{ marginLeft: "auto", marginTop: "auto", marginBottom: "auto", marginRight: "10px" }}>
                            <Button
                              type='primary'
                              icon={<CloseCircleOutlined />}
                              onClick={() => {
                                setSelectedItem(prev => ({
                                  isPatientSelected: false,
                                  isInstitutionSelected: false,
                                  isImagesSelected: false,
                                  isOhifViewerSelected: false,
                                  templateId: false,
                                  isStudyDescriptionSelected: false, 
                                  isManualImageOpen: false
                                }))
                              }}
                            />
                          </div>

                        </div>
                        
                        <Spin spinning = {manualStudyLoading}>
                          <Flex className='report-all-manual-image-div'
                            wrap = {"wrap"}
                            gap={10}
                          >
                            {manualStudyImages?.length > 0 && 
                              [...manualStudyImages]?.map((element) => {
                              return (
                                <Image
                                  src={element?.image}
                                  className='report-manual-image'
                                />
                              )
                            })}
                          </Flex>
                        </Spin>

                      </div>
                       */}
                    </div>

                  </Splitter.Panel>
                )}

              {/* Study description selection and Editor related option  */}
              <Splitter.Panel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>

                  <div style={{ width: "50%" }}>
                    <div style={{ paddingLeft: 10 }}>
                      <Form labelAlign="left" form={form}>
                        <Form.Item
                          name="study_description"
                          className="report-description-selection"
                          rules={[
                            { required: true, message: "Please select Modality Study Description" },
                          ]}
                        >
                          <Tooltip title = {"Study Description"}>
                            <Select
                              placeholder="Select Study Description"
                              className='reporting-study-description-selection'
                              showSearch
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                              }
                              style={{
                                fontWeight: 600
                              }}
                              dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Divider style={{ margin: "8px 0" }} />
                                  <Space style={{ padding: "0 8px 4px" }}>
                                    <Input placeholder="Please enter item" ref={inputRef} value={name} onChange={onNameChange} onKeyDown={(e) => e.stopPropagation()} />
                                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                      Add item
                                    </Button>
                                  </Space>
                                </>
                              )}
                              options={items.map((item) => ({ label: item?.label, value: item?.value }))}
                              value={reportStudyDescription}
                              onChange={(value) => setReportStudyDescription(value)}
                            />
                          </Tooltip>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>

                  <Flex style={{ width: "47%", justifyContent: "flex-end", gap: 15 }}>

                    <div style={{ marginTop: "auto", marginBottom: "auto"}}>
                      <Tooltip title="Report template">
                        <Select
                          placeholder="choose template"
                          options={templateOption?.map((element) => {
                            return {
                              label: `${element?.modality} | ${element?.label}`, 
                              value: element?.value
                            }
                          })}
                          style={{width: 200}}
                          showSearch
                          value={selectedItem?.templateId}
                          onChange={(e) =>
                            setSelectedItem((prev) => ({
                              isPatientSelected: prev?.isPatientSelected,
                              isInstitutionSelected: prev?.isInstitutionSelected,
                              isImagesSelected: prev?.isImagesSelected,
                              templateId: e,
                              isStudyDescriptionSelected: prev?.isStudyDescriptionSelected,
                            }))
                          }
                        />
                      </Tooltip>
                    </div>

                    <div >
                      <Button type="primary"
                        loading={isLoading}
                        onClick={() => handleReportSave()}
                        style={{ marginTop: 10 }}>
                        Submit Report
                      </Button>
                    </div>

                    <Button type="primary"
                      onClick={() => navigate(-1)}
                      style={{ marginTop: "auto", marginBottom: "auto" }}
                    >
                      Back
                    </Button>

                  </Flex>
                </div>

                <Divider style={{ marginTop: 5, marginBottom: 8 }} />

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

              </Splitter.Panel>

            </Splitter>

          </Spin>

        </Card>

      </div>

      {/* ====== Report review related information model =====  */}
      <Modal
        title="Report Preview"
        className="report-preview-modal"
        open={selectedItem?.showPreview}
        onCancel={() => {
          setSelectedItem((prev) => ({
            isPatientSelected: false,
            isInstitutionSelected: false,
            isImagesSelected: false,
            isOhifViewerSelected: false,
            templateId: prev?.templateId,
            isStudyDescriptionSelected: false,
            showPreview: false,
          }));
        }}
        centered
        width={"fit-content"}
        style={{
          content: {
            height: "100vh"
          }
        }}
        footer={null}
      >
        {editorData !== null && selectedItem?.showPreview && (
          <div className="a4-preview-container">
            <div className="a4-page">
              <div
                className="html-preview"
                dangerouslySetInnerHTML={{
                  __html: `
                    ${EmailHeaderContent} 
                    ${editorData} 
                    <div style="margin-top: 20px; text-align: left;">
                      <p>Reported By,</p>
                      <img src=${signatureImage} alt="signature image" style="width:200px;height:100px;text-align: left;">
                    </div>
                    <p style="text-align: left; font-weight: 600; font-size: 16px;">${username}</p>
                    ${ReportDesclamierContent}
                  `,
                }}
              ></div>
            </div>
          </div>
        )}
      </Modal>


      {/* ====== Patient information related drawer ======  */}
      <Drawer
        title="Patient Info"
        placement='left'
        closable={true}
        onClose={() => { setPatientInformationDrawer(false) }}
        open={patientInforamtionDrawer}
        className='patient-info-drawer'
        width={"30vw"}
      >

        <div className='drawer-info-div' style={{
          borderWidth: 0,
          width: "100%"
        }}>

          {/* ========= Patient information option button ==========  */}
          <Button type={partientInfoDrawerOption == "info" ? "primary" : "default"} style={{
            marginTop: 0,
            marginRight: 10
          }} onClick={() => { setPatientInfoDrawerOption("info") }}>
            <div className='drawer-title' >
              Patient Data
            </div>
          </Button>

          {/* ========== Report information option button ===========  */}
          <Button type={partientInfoDrawerOption == "report" ? "primary" : "default"}
            onClick={() => { setPatientInfoDrawerOption("report") }}
          >
            <div className='drawer-title'>
              Previous Report
            </div>
          </Button>
        </div>


        <Divider style={{ marginTop: 10, marginBottom: 15 }} />

        {/* Patient information  */}
        {(patientInformation !== undefined && partientInfoDrawerOption == "info") && (
          <>  

            <div>
              <div className='drawer-info-main-div'>
                {/* Patient name information  */}
                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Patient Name</div>
                  <div className='drawer-info-data'>{patientInformation?.Patient_name || "-"}</div>
                </div>

                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Patient Id</div>
                  <div className='drawer-info-data'>{patientInformation?.Patient_id || "-"}</div>
                </div>
              </div>

              <div className='drawer-info-main-div'>
                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Gender</div>
                  <div className='drawer-info-data'>{patientInformation?.Gender || "-"}</div>
                </div>

                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>DOB</div>
                  <div className='drawer-info-data'>{patientInformation?.DOB || "-"}</div>
                </div>
              </div>

              <div className='drawer-info-main-div'>
                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>AGE</div>
                  <div className='drawer-info-data'>{patientInformation?.Age || "-"}</div>
                </div>

                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Referring Physician Name</div>
                  <div className='drawer-info-data'>{patientInformation?.Referring_physician_name || "-"}</div>
                </div>
              </div>

              <div className='drawer-info-main-div'>
                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Performing Physician Name</div>
                  <div className='drawer-info-data'>{patientInformation?.Performing_physician_name || "-"}</div>
                </div>

                <div className='drawer-info-div'
                  style={{ backgroundColor: "#efefef" }}>
                  <div className='drawer-info-title'>Modality</div>
                  <div className='drawer-info-data'>{patientInformation?.Modality || "-"}</div>
                </div>
              </div>

              <div className='drawer-info-main-div' style={{
              }}>
                <div className='drawer-info-div'
                  style={{ backgroundColor: "#efefef" }}>
                  <div style={{ display: "flex" }}>
                    {/* <Button
                      icon={<PlusOutlined />}
                      style={{ marginTop: "auto", marginBottom: "auto", marginLeft: 10 }}
                      onClick={() => {
                        setSelectedItem(prev => ({
                          isPatientSelected: false,
                          isInstitutionSelected: false,
                          isImagesSelected: false,
                          isOhifViewerSelected: false,
                          templateId: prev?.templateId,
                          isStudyDescriptionSelected: true
                        }))
                      }}
                    /> */}
                    <div>
                      <div className='drawer-info-title'>Study Description</div>
                      <div className='drawer-info-data'>{patientInformation?.Study_description || "-"}</div>
                    </div>
                  </div>
                </div>

                <div className='drawer-info-div'
                  style={{ backgroundColor: "#efefef" }}>
                  <div className='drawer-info-title'>Patient Comments</div>
                  <div className='drawer-info-data'>{patientInformation?.Patient_comments || "-"}</div>
                </div>
              </div>

              <div className='drawer-info-main-div'>
                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Number Of Report</div>
                  <div className='drawer-info-data'>{patientInformation?.number_of_report || "-"}</div>
                </div>

                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Study Assign time</div>
                  <div className='drawer-info-data'>{patientInformation?.study_assign_time || "-"}</div>
                </div>
              </div>

              <div className='drawer-info-main-div'>
                <div className='drawer-info-div'>
                  <div className='drawer-info-title'>Assing To</div>
                  <div className='drawer-info-data'>{patientInformation?.study_assign_username || "-"}</div>
                </div>
              </div>


              {(assignStudyDataImage?.length > 0 || assignStudyDataDocument?.length > 0 ) && (
                <>
                  <Divider style={{marginTop: 10, marginBottom: 10}}/>
                  <div style={{fontWeight: 600, marginBottom: 8}}>
                    Study documents
                  </div>
                </>
              )}

              <Flex wrap = {"wrap"} gap={8}>
                { assignStudyDataImage?.length > 0 && 
                  [...assignStudyDataImage]?.map((element) => {
                    return(
                      <Image
                        src= {element}
                        className='report-previous-history-image'
                      />
                    )  
                })}
              </Flex>
              
              <div style={{marginTop: 15}}>
                {assignStudyDataDocument?.length > 0 && 
                  assignStudyDataDocument?.map((element) => {
                    return(
                      <Flex style={{marginTop: 8, cursor: "pointer"}}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = element;
                          link.target = "_blank";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <DownloadOutlined
                          style={{fontSize: 18}}
                        />
                        <span className='report-previous-history-document-name'>
                          {getFileNameFromURL(element)}
                        </span>
                      </Flex>
                    )
                  })}
              </div>


            </div>

          </>
        )}

        {/* Report information  */}

        {partientInfoDrawerOption !== "info" && (
          <>
            <Table
              columns={columns}
              dataSource={patientReportList}
              pagination={false}
            />
          </>
        )}

      </Drawer>

    </>
  )
}

export default Editor
