import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Button, Card, Popconfirm } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { downloadAdvancedFileReport } from '../apis/studiesApi'
import NotificationMessage from './NotificationMessage'
import APIHandler from '../apis/apiHandler';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd'; 
import { UserPermissionContext } from '../hooks/userPermissionContext' ; 
import { EmailHeaderContent } from '../helpers/utils'
import { ReportDesclamierContent } from '../helpers/utils'
import { DownloadOutlined } from '@ant-design/icons'

const ViewReport = ({ id }) => {
  const [editorData, setEditorData] = useState('')
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {permissionData} = useContext(UserPermissionContext) ; 
  const [downloadReportLoading, setDownloadReportLoading] = useState(false) ; 

  const otherPremissionStatus = (title, permission_name) => {
    const permission = permissionData[title]?.find(
      data => data.permission === permission_name
    )?.permission_value
    return permission
  }

  useEffect(() => {
    retrieveReportData()
  }, [id])

  const retrieveReportData = async () => {
    await downloadAdvancedFileReport({ id })
      .then(res => {
        if (res.data.status) {
          setEditorData(res.data.message)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', err.response.data.message))
  }

  // ******* Update report related option handler *********** // 
  const UpdateReportHandler = async () => {
    if (localStorage.getItem('studyId') == null){
      NotificationMessage("Have some internal error try again") ; 
    } else {
      let report_content = `${EmailHeaderContent}
        ${editorData}
        ${ReportDesclamierContent}
      `
      setLoading(true) ; 
      let requestPayload = {
        id: id,
        report: report_content, 
        studyId: localStorage.getItem("studyId")
      };
      let responseData = await APIHandler("POST", requestPayload, "studies/v1/update-report");
      if (responseData === false) {
        NotificationMessage("warning", "Network request failed", "", 1, "topLeft");
      } else if (responseData['status'] === true) {
        NotificationMessage("success", "Update report successfully", "", 1, "topLeft");
        navigate(-1)
      } else {
        NotificationMessage("warning", responseData['message'], "", 1, "topLeft");
      }
  
      setLoading(false);
    }

  }

  // ******* Save report as draft related option handler *********** // 
  const saveDraftReportOptionHandler = async () => {
    if (localStorage.getItem('studyId') == null){
      NotificationMessage("Have some internal error try again") ; 
    } else {
      setLoading(true) ; 
      let report_content = `
        ${EmailHeaderContent}
        ${editorData}
        <div/>
        <body/>
        <html/>
      `
      let requestPayload = {
        id: id,
        report: report_content, 
        studyId: localStorage.getItem("studyId")
      };
      let responseData = await APIHandler("POST", requestPayload, "studies/v1/draft-reoprt");
      if (responseData === false) {
        NotificationMessage("warning", "Network request failed", "", 1, "topLeft");
      } else if (responseData['status'] === true) {
        NotificationMessage("success", "Report save as draft", "", 1, "topLeft");
        navigate(-1) ; 
      } else {
        NotificationMessage("warning", responseData['message'], "", 1, "topLeft");
      }
  
      setLoading(false);
    }
  }

  // ************ Download report related option button handler ********** // 

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

  const downloadReport = async () => {
    let requestPayload = { id: localStorage.getItem("studyId") };
    setDownloadReportLoading(true); 

    let responseData = await APIHandler('POST', requestPayload, 'studies/v1/complete-study');

    if (responseData === false) {
      NotificationMessage("warning", "Network request failed");

    } else if (responseData['status'] === true) {

      let responseData = await APIHandler("POST", { id: id }, "studies/v1/report-download");

      if (responseData === false) {

        NotificationMessage(
          "warning",
          "Network request failed"
        );

      } else if (responseData?.status) {

        let report_download_url = responseData?.message;
        let report_patient_name = "Patient-name";
        let report_patient_id = "Patient-id" ; 

        let updated_report_name = `${report_patient_id}-${report_patient_name}-report.pdf`;

        downloadPDF(report_download_url, updated_report_name);

      } else {

        NotificationMessage(
          "warning",
          "Network request failed",
          responseData?.message
        )
      }

    } else {

      NotificationMessage("warning", "Network request failed", responseData['message']);
    }

    setDownloadReportLoading(false) ; 
  }

  return (
    <div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginBottom: '10px', 
          marginTop: "-15px"
        }}
      > 

        {/* ========= Save Report as Draft and Update report options =========  */}
        
        {otherPremissionStatus("Studies permission", "Update Report") && (
          <>
            <Button type="primary"
              onClick={() => UpdateReportHandler()}>
                Update report
            </Button>
            <Button  onClick={() => {saveDraftReportOptionHandler()}}>
              Save as Draft
            </Button>
          </>
        )}

        {/* ====== Download reoprt option button =====  */}
        <Button
          icon = {<DownloadOutlined/>}
          loading = {downloadReportLoading}
          onClick={() => {downloadReport()}}
        >
          Download Report
        </Button>

        {otherPremissionStatus("Studies permission", "Update Report") && (
          <>
            <Popconfirm
              title = "Are you sure you want to go back?"
              onConfirm={() => {navigate(-1)}}
            >
              <Button>Back</Button>
            </Popconfirm>
          </>
        )}
        
        {!otherPremissionStatus("Studies permission", "Update Report") && (
          <>
            <Button onClick={() => {navigate(-1)}}>Back</Button>
          </>
        )}


      </div>

      <Spin spinning={loading}>
        <Card className='Advance-view-report-layout'>
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData()
              setEditorData(data)
            }}
          />
        </Card>

      </Spin>

    </div>
  )
}

export default ViewReport
