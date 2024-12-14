import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import '../../ckeditor5/build/ckeditor'
import { Button, Card, Col, Row, Spin, Typography, Input, Select, Form, Divider, Space, Tooltip, Modal, Drawer, Table } from 'antd'
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
import OHIF from "../assets/images/menu.png";
import KitWareViewer from "../assets/images/viewers.png";
import TableWithFilter from './TableWithFilter'
import { convertToDDMMYYYY } from '../helpers/utils'
import { Splitter } from 'antd'
import OHIFViewer from "../assets/images/menu.png";
import WeasisViewer from "../assets/images/Weasis.png";
import { BsEyeFill } from 'react-icons/bs'

const Editor = ({ id }) => {

  const [editorData, setEditorData] = useState('')
  const [cardDetails, setCardDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { selectedItem, setSelectedItem, docFiledata } = useContext(ReportDataContext)
  const { setTemplateOption, patientInforamtionDrawer, setPatientInformationDrawer } = useContext(filterDataContext)
  const [studyImageID, setStudyImageID] = useState(0)
  const [signatureImage, setSignatureImage] = useState(null)
  const [username, setUsername] = useState('')
  const user_id = localStorage.getItem('userID')
  const navigate = useNavigate();

  const [institutionReport, setInstitutionReport] = useState({});
  const [referenceImageCount, setReferenceImageCount] = useState(1);
  const [seriesId, setSeriesId] = useState(null);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  const [convertTableInformation, setConvertTableInformation] = useState(undefined);
  const [studyDescriptionReload, setStudyDescriptionReload] = useState(0);

  const [form] = Form.useForm();
  const [reportStudyDescription, setReportStudyDescription] = useState(null);
  const [items, setItems] = useState(descriptionOptions);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const [partientInfoDrawerOption, setPatientInfoDrawerOption] = useState("info");

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

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems([{ label: name, value: name }, ...items]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

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
  const [institutionId, setInstitutionId] = useState(undefined);
  const [genderId, setGenderId] = useState(undefined);
  const [patientInformation, setPatientInformation] = useState(undefined);
  const [patientReportList, setPatientReportList] = useState([]);

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

      setReportStudyDescription(responseData?.data?.Study_description || undefined);
      setPatientInformation(responseData?.data);
      setPatientReportList(responseData?.report || []);

      localStorage.setItem("report-modality", responseData?.data?.Modality);
      setTemplateOption(responseData?.data?.Modality);

      let Institution_id = responseData['data']['institution_id']
      let SeriesIdValue = responseData['data']['series_id']

      setSeriesId(SeriesIdValue);
      setInstitutionId(responseData?.data?.institution_id);
      setGenderId(responseData?.data?.Gender);

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
        let tempData = reportResponseData?.data;
        let tempPatientId = tempData?.patient_details['Patient id'];
        let tempPatientName = tempData?.patient_details['Patient name'];

        delete tempData?.patient_details['Patient id']
        delete tempData?.patient_details['Patient name'];

        setInstitutionReport({ ...reportResponseData['data'] })
        setConvertTableInformation({ "patient_details": { ...{ "Patient id": tempPatientId, "Patient name": tempPatientName }, ...tempData?.patient_details }, "institution_details": { ...tempData?.institution_details } })
        convertedPatientTableInitially({ "patient_details": { ...{ "Patient id": tempPatientId, "Patient name": tempPatientName }, ...tempData?.patient_details }, "institution_details": { ...tempData?.institution_details } })
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
          let tempData = editorData;
          tempData = tempData + res?.data?.data?.report_data;
          setEditorData(tempData)
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

  useEffect(() => {
    if (selectedItem?.showPreview == true) {
      setIsReportPreviewOpen(true);
    }

  }, [selectedItem?.showPreview]);


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
    institutionReport.patient_details = Object.assign(institutionReport.patient_details);
    const keys = Object.keys(institutionReport?.institution_details);
    var temp = ``;
    const data = `<div>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${institutionReport.hasOwnProperty('patient_details') && selectedItem.isPatientSelected ?
        Object.entries(institutionReport?.patient_details)
          .map(([key, value], index) => {
            // Check for null value and replace with "-"
            const displayValue = value === null ? '-' : value;

            temp = `
                <tr>
                  <td style="text-align: left; padding: 8px;font-weight:600">${key}</td>
                  <td style="padding: 8px;">${displayValue}</td>`;

            if (index < keys.length) {
              const institutionKey = keys[index];
              const institutionValue = institutionReport.institution_details[institutionKey];
              const displayInstitutionValue = institutionValue === null ? '-' : institutionValue;

              temp += `
                    <td style="text-align: left; padding: 8px;font-weight:600">${institutionKey}</td>
                    <td style="padding: 8px;">${displayInstitutionValue}</td></tr>`;
            } else {
              temp += `</tr>`;
            }

            return temp;

          })
          .join('')
        : ''}
        </tbody>
      </table>
    </div>`;

    setEditorData(prev => `${prev}${data}`);
  };

  const initializePatientTableData = (institutionReport) => {
    institutionReport.patient_details = Object.assign(institutionReport.patient_details);
    const keys = Object.keys(institutionReport?.institution_details);
    var temp = ``;
    const data = `<div>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${institutionReport.hasOwnProperty('patient_details') && selectedItem.isPatientSelected ?
        Object.entries(institutionReport?.patient_details)
          .map(([key, value], index) => {
            // Check for null value and replace with "-"
            const displayValue = value === null ? '-' : value;

            temp = `
                <tr>
                  <td style="text-align: left; padding: 8px;font-weight:600">${key}</td>
                  <td style="padding: 8px;">${displayValue}</td>`;

            if (index < keys.length) {
              const institutionKey = keys[index];
              const institutionValue = institutionReport.institution_details[institutionKey];
              const displayInstitutionValue = institutionValue === null ? '-' : institutionValue;

              temp += `
                    <td style="text-align: left; padding: 8px;font-weight:600">${institutionKey}</td>
                    <td style="padding: 8px;">${displayInstitutionValue}</td></tr>`;
            } else {
              temp += `</tr>`;
            }

            return temp;

          })
          .join('')
        : ''}
        </tbody>
      </table>
    </div>`;
    return data;
  };

  // **** Submit report handler **** // 
  const handleReportSave = async () => {
    if (reportStudyDescription == null) {
      NotificationMessage("warning", "Please, Select report study description")
    } else {

      console.log(`${editorData} ${`
          <p style="text-align: left; margin-top: 20px;">
            <p>Reported By,</p>
            <img src=${signatureImage} alt="signature image" style="width:200px;height:100px;text-align: left;">
          </p>`} ${`
            <p style="text-align: left; font-weight: 600; font-size: 16px;">
              ${username}
        </p>`}`);


      // setIsLoading(true);
      // await saveAdvancedFileReport({
      //   id,
      //   report: `${editorData} ${`
      //     <p style="text-align: left; margin-top: 20px;">
      //       <p>Reported By,</p>
      //       <img src=${signatureImage} alt="signature image" style="width:200px;height:100px;text-align: left;">
      //     </p>`} ${`
      //       <p style="text-align: left; font-weight: 600; font-size: 16px;">
      //         ${username}
      //       </p>`}`,
      //   report_study_description: reportStudyDescription
      // })
      //   .then(res => {
      //     if (res.data.status) {
      //       navigate(-1)
      //     } else {
      //       NotificationMessage(
      //         'warning',
      //         'Network request failed',
      //         res.data.message
      //       )
      //     }
      //   })
      //   .catch(err => NotificationMessage('warning', err.response.data.message))
      // setIsLoading(false)
    }


  }

  useEffect(() => {
    if (docFiledata !== "" && convertTableInformation != undefined) {
      let data = initializePatientTableData(convertTableInformation);
      setEditorData(data + docFiledata)
      setReportStudyDescription(null);
    }
  }, [docFiledata, convertTableInformation])


  const scrollToBottom = () => {
    var scrollingDiv = document.getElementById("scrollingDiv");
    scrollingDiv.scrollTop = scrollingDiv.scrollHeight;
  }

  // **** Reterive templates list for Study report page **** //
  const [templateOption, setTemplateOptions] = useState([]);
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
        value: data?.id
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

  useEffect(() => {
    if (reportStudyDescription !== null) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(editorData, "text/html");
      const rows = doc.querySelectorAll("tr");
      rows.forEach((row) => {
        const firstCell = row.querySelector("td strong");
        if (firstCell && firstCell.textContent.trim() === "Study description") {
          const valueCell = row.querySelector("td:nth-child(2)");
          if (valueCell) {
            valueCell.textContent = reportStudyDescription;
          }
        }
      });
      const serializer = new XMLSerializer();
      const updatedEditorData = serializer.serializeToString(doc);
      setEditorData(updatedEditorData);
    }
  }, [reportStudyDescription, studyDescriptionReload]);

  // Weasis viewer option handler 
  const WeasisViewerHandler = (patientId) => {

    const originalString = `$dicom:rs --url "https://viewer.cloudimts.com/dicomweb" -r "patientID=${patientId}"`;
    let encodedString = encodeURIComponent(originalString);
    encodedString = "weasis://" + encodedString;
    window.open(encodedString, "_blank");
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

              {(selectedItem?.isImagesSelected || selectedItem?.isOhifViewerSelected) && (
                <Splitter.Panel min="20%" max="70%" defaultSize="50%"
                >
                  {/* OHIF viewer and Study Images related option  */}
                  <div className='report-details-div'>

                    {/* Study Images related slider */}
                    {selectedItem?.isImagesSelected && imageSlider.length > 0 && (
                      <>
                        <div style={{ display: "flex" }}>
                          <div>
                            <Typography.Title style={{
                              fontSize: "22px",
                              marginTop: 10
                            }}>
                              {String("Study Images")}
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

                        <div style={{ width: "100%", textAlign: "right", paddingRight: 10 }}>
                          <Button
                            style={{ marginLeft: "auto" }}
                            type='primary'
                            onClick={() => {
                              convertPatientDataToTable(true);
                              NotificationMessage("success", "Images added successfully")
                            }}>
                            Insert
                          </Button>
                        </div>
                      </>
                    )}

                    {/* ==== Show OHIF Viewer information ====  */}

                    {selectedItem?.isOhifViewerSelected && (
                      <>
                        <div style={{ width: "100%", height: "100%", overflowY: "auto" }} onBeforeInput={scrollToBottom}>
                          <iframe src={studyUIDInformation} width="100%" height="800px" className='ohif-container' id='ohif-frame'></iframe>

                          <Button
                            style={{ marginLeft: "auto" }}
                            type='primary'
                            onClick={() => {
                              let frameObj = document.getElementById('ohif-frame');

                              if (frameObj && frameObj.contentWindow) {
                                // Access the iframe content (same-origin)
                                let frameContent = frameObj.contentWindow.document.body.innerHTML;

                                // Check and log the content
                                if (frameContent) {
                                  console.log(frameContent);
                                } else {
                                  console.log('Unable to access iframe content');
                                }
                              } else {
                                console.error('Iframe is not available or is not loaded yet.');
                              }

                            }}
                          >
                            Insert
                          </Button>

                        </div>
                      </>
                    )}

                    {/* {selectedItem?.isOhifViewerSelected && (
                      <>
                        <div className='btn-div insert-report-details-option'>
                          <Button type='primary' onClick={() => convertPatientDataToTable(true)}>
                            Insert
                          </Button>
                        </div>

                      </>
                    )} */}
                  </div>

                </Splitter.Panel>
              )}


              {/* Study description selection and Editor related option  */}

              <Splitter.Panel>
                <div style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap"
                }}>

                  <div style={{
                    marginBottom: "auto",
                    marginTop: 15,
                    fontWeight: 600
                  }}>
                    Study Description
                  </div>

                  {/* Study description selection  */}
                  <div style={{ width: "50%" }}>
                    <Form
                      labelAlign="left"
                      form={form}
                    >
                      <Form.Item
                        name="study_description"
                        className="report-description-selection"
                        rules={[
                          {
                            required: true,
                            message: "Please select Modality Study Description",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Study Description"
                          showSearch
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.label ?? "").toLowerCase())
                          }
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider
                                style={{
                                  margin: '8px 0',
                                }}
                              />
                              <Space
                                style={{
                                  padding: '0 8px 4px',
                                }}
                              >
                                <Input
                                  placeholder="Please enter item"
                                  ref={inputRef}
                                  value={name}
                                  onChange={onNameChange}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                  Add item
                                </Button>
                              </Space>
                            </>
                          )}
                          options={items.map((item) => ({
                            label: item?.label,
                            value: item?.value,
                          }))}
                          value={reportStudyDescription}
                          onChange={(value) => {
                            setReportStudyDescription(value)
                          }}
                        />
                      </Form.Item>
                    </Form>
                  </div>

                  <div style={{
                    marginBottom: "auto",
                    marginTop: 15,
                    fontWeight: 600,
                    marginLeft: 10,
                    marginRight: 10
                  }}>
                    Template
                  </div>

                  {/* Study template related selection  */}
                  <div style={{
                    marginTop: 10
                  }}>
                    <Select
                      style={{ width: "12rem" }}
                      className='template-selection-option-division'
                      placeholder='choose template'
                      options={templateOption}
                      showSearch
                      value={selectedItem?.templateId}
                      onChange={e =>
                        setSelectedItem(prev => ({
                          isPatientSelected: prev?.isPatientSelected,
                          isInstitutionSelected: prev?.isInstitutionSelected,
                          isImagesSelected: prev?.isImagesSelected,
                          templateId: e,
                          isStudyDescriptionSelected: prev?.isStudyDescriptionSelected
                        }))
                      }
                    />
                  </div>

                  <div style={{
                    marginTop: 10,
                    marginLeft: "auto"
                  }}>
                    <Button type='primary' onClick={() => handleReportSave()}>
                      Submit Report
                    </Button>
                  </div>
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

      {/* ======= Report preview related information model =======  */}
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
        // width="794px"
        style={{
          content: {
            height: "100vh"
          }
        }}
        footer={null}
      >
        {editorData !== null && (
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


      {/* ======== Patient information related drawer information =========  */}
      <Drawer
        title="Patient Info"
        placement='left'
        closable={true}
        onClose={() => { setPatientInformationDrawer(false) }}
        open={patientInforamtionDrawer}
        className='patient-info-drawer'
        width={"50vw"}
      >

        <div className='drawer-info-div' style={{
          borderWidth: 0,
        }}>

          {/* Patient information option button  */}
          <Button type={partientInfoDrawerOption == "info" ? "primary" : "default"} style={{
            marginTop: 0,
            marginRight: 10
          }} onClick={() => { setPatientInfoDrawerOption("info") }}>
            <div className='drawer-title' >
              Patient Data
            </div>
          </Button>

          {/* Report information option button  */}
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
