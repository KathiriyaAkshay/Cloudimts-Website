import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Button, Card } from 'antd'
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

  const UpdateReportHandler = async () => {

    setLoading(true);

    let requestPayload = {
      id: id,
      report: editorData
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
          <Button type="ghost" onClick={() => UpdateReportHandler()}>Update report</Button>
        )}
        <Button onClick={() => navigate(-1)}>Back</Button>

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
