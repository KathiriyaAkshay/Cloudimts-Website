import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Button, Card, Popconfirm } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { downloadAdvancedFileReport } from '../apis/studiesApi'
import NotificationMessage from './NotificationMessage'
import APIHandler from '../apis/apiHandler';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd'; 
import { UserPermissionContext } from '../hooks/userPermissionContext'

const ViewReport = ({ id }) => {
  const [editorData, setEditorData] = useState('')
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {permissionData} = useContext(UserPermissionContext) ; 

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
      setLoading(true) ; 
      let requestPayload = {
        id: id,
        report: editorData, 
        studyId: localStorage.getItem("studyId")
      };
      let responseData = await APIHandler("POST", requestPayload, "studies/v1/update-report");
      if (responseData === false) {
        NotificationMessage("warning", "Network request failed");
      } else if (responseData['status'] === true) {
        NotificationMessage("success", "Update report successfully");
      } else {
        NotificationMessage("warning", responseData['message']);
      }
  
      setLoading(false);
    }

  }

  // ******* save report as draft related option handler *********** // 
  const saveDraftReportOptionHandler = async () => {
    if (localStorage.getItem('studyId') == null){
      NotificationMessage("Have some internal error try again") ; 
    } else {
      setLoading(true) ; 
      let requestPayload = {
        id: id,
        report: editorData, 
        studyId: localStorage.getItem("studyId")
      };
      let responseData = await APIHandler("POST", requestPayload, "studies/v1/draft-reoprt");
      if (responseData === false) {
        NotificationMessage("warning", "Network request failed");
      } else if (responseData['status'] === true) {
        NotificationMessage("success", "Report save as draft");
      } else {
        NotificationMessage("warning", responseData['message']);
      }
  
      setLoading(false);
    }
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
