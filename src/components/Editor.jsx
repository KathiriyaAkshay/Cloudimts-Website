import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import '../../ckeditor5/build/ckeditor'
import { Button, Card, Col, Row, Spin, Typography, Input, Select, Form, Divider, Space, Tooltip, Modal, Drawer } from 'antd'
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
import { descriptionOptions, EmailHeaderContent } from '../helpers/utils'
import { PlusOutlined } from '@ant-design/icons'
import OHIF from "../assets/images/menu.png";
import KitWareViewer from "../assets/images/viewers.png";
import TableWithFilter from './TableWithFilter'
import { convertToDDMMYYYY } from '../helpers/utils'
import Draggable from 'react-draggable'

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

  const [form] = Form.useForm();
  const [reportStudyDescription, setReportStudyDescription] = useState(null);
  const [items, setItems] = useState(descriptionOptions);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const [partientInfoDrawerOption, setPatientInfoDrawerOption] = useState("info");

  const columns = [
    {
      title: 'Report Time',
      dataIndex: 'reporting_time',
      render: (text, record) => convertToDDMMYYYY(record?.reporting_time)
    },

    {
      title: 'Report By',
      dataIndex: 'report_by',
      render: (text, record) => record?.report_by?.username
    },

    {
      title: 'Study Description',
      dataIndex: 'study_description'
    },

    {
      title: 'Report Type',
      dataIndex: 'report_type'
    },

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

      // Set Patient information 
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
  </div>
  <div>
      Report
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
        report: `${editorData} ${`<p style="text-align: left; margin-top: 20px;"><img src=${signatureImage} alt="signature image" style="width:512px;height:160px;text-align: right;"></p>`} ${`<p style="text-align: right;">${username}</p>`}`,
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

  useEffect(() => {
    setEditorData(prev => prev + docFiledata)
  }, [docFiledata])


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


  const [width, setWidth] = useState(400); // Initial width of the div
  const [isResizing, setIsResizing] = useState(false);

  // Start resizing when the left mouse button is pressed
  const handleMouseDown = (e) => {
    if (e.button === 0) { // 0 means left mouse button
      setIsResizing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    setWidth(e.clientX); // Set the width based on the mouse position
  };

  // Stop resizing when the mouse button is released
  const handleMouseUp = (e) => {
    if (e.button === 0) { // Only stop resizing if the left button is released
      setIsResizing(false);
    }
  };


  React.useEffect(() => {
    // Attach the mousemove and mouseup events to the document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);


  return (
    <>

      {/* Editor and Study description related information  */}
      <div>
        <Card
          style={{ minHeight: 'calc(100vh - 140px)' }}
          className='report-card'
        >
          <Spin spinning={isLoading}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>

              <div
                className="resizable-div"
                style={{
                  width: `${width}px`,
                  height: '100%',
                  border: '1px solid #ddd',
                  position: 'relative',
                }}
              >
                {/* OHIF viewer and Study Images related option  */}
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

                  <div style={{ width: "100%", height: "100%", overflowY: "auto" }} onBeforeInput={scrollToBottom}>
                    <iframe src={studyUIDInformation} width="100%" height="800px" className='ohif-container'></iframe>
                  </div>

                  {selectedItem?.isOhifViewerSelected && (
                    <>
                    </>
                  )}

                  {selectedItem?.isOhifViewerSelected && (
                    <>
                      <div className='btn-div insert-report-details-option'>
                        <Button type='primary' onClick={() => convertPatientDataToTable(true)}>
                          Insert
                        </Button>
                      </div>

                    </>
                  )}
                </div>

                <div
                  className="resize-handle"
                  style={{
                    width: '10px',
                    height: '100%',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    cursor: 'ew-resize',
                    backgroundColor: '#ccc',
                  }}
                  onMouseDown={handleMouseDown}
                />

              </div>

              {/* Study description selection and Editor related option  */}

              <div style={{ flex: 1, overflow: 'auto' }}>
                <div style={{
                  display: "flex",
                  gap: 10
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
                      File Report
                    </Button>
                  </div>
                </div>

                <Divider style={{ marginTop: -8, marginBottom: 8 }} />

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

              </div>

            </div>

          </Spin>

        </Card>

      </div>

      {isReportPreviewOpen && (
        <Modal
          title="Report Preview"
          className='report-preview-model'
          open={isReportPreviewOpen}
          onCancel={() => { setIsReportPreviewOpen(false) }}
          centered
          width={"70%"}
          footer={null}
          style={{
            content: {
              overflowY: "auto",
              maxHeight: "85vh",
              overflowY: "auto"
            },
          }}
        >
          <div style={{
            backgroundColor: "#efefef",
            padding: "10px"
          }}>
            {editorData !== null && (

              <div
                className='html_preview'
                dangerouslySetInnerHTML={{
                  __html: `${EmailHeaderContent} ${editorData}
                  </body>
                  </html> `}}
              >

              </div>
            )}
          </div>
        </Modal>
      )}

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
          <Button type='primary' style={{
            marginTop: 0,
            marginRight: 10
          }} onClick={() => { setPatientInfoDrawerOption("info") }}>
            <div className='drawer-title' >
              Patient Information
            </div>
          </Button>

          {/* Report information option button  */}
          <Button type='primary'
            onClick={() => { setPatientInfoDrawerOption("report") }}
          >
            <div className='drawer-title'>
              Report
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

            <div className='drawer-info-main-div'>
              <div className='drawer-info-div'
                style={{ backgroundColor: "#efefef" }}>
                <div className='drawer-info-title'>Study Description</div>
                <div className='drawer-info-data'>{patientInformation?.Study_description || "-"}</div>
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
            <TableWithFilter
              tableColumns={columns}
              tableData={patientReportList}
            />
          </>
        )}

      </Drawer>

    </>
  )
}

export default Editor
