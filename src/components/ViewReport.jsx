import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Button, Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { downloadAdvancedFileReport } from '../apis/studiesApi'
import NotificationMessage from './NotificationMessage'
import { useNavigate } from 'react-router-dom'

const ViewReport = ({ id }) => {
  const [editorData, setEditorData] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    retrieveReportData()
  }, [id])

  const retrieveReportData = async () => {
    await downloadAdvancedFileReport({ id })
      .then(res => {
        if (res.data.status) {
          setEditorData(res.data.data.report)
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

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginBottom: '10px'
        }}
      >
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
      <Card>
        <CKEditor
          editor={ClassicEditor}
          data={editorData}
          disabled
          // onReady={(editor) => {
          //   editor.plugins.get("FileRepository").createUploadAdapter = (
          //     loader
          //   ) => {
          //     return new UploadAdapter(loader);
          //   };
          // }}
          onChange={(event, editor) => {
            const data = editor.getData()
            setEditorData(data)
          }}
        />
      </Card>
    </div>
  )
}

export default ViewReport
