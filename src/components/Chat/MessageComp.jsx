import React from 'react'
import { saveAs } from 'file-saver'
import { useNavigate } from 'react-router'
import moment from 'moment/moment'
import ChatSettingPop from './ChatSettingPop'
import PdfImg from '../../assets/images/pdf.svg'
import downloadImg from '../../assets/images/download-chat-img.png'
import Excel from '../../assets/images/microsoft-excel-icon.svg'
import Document from '../../assets/images/Document_chat.svg'
import chatFileImg from '../../assets/images/chat-file-icon.svg'
import Word from '../../assets/images/microsoft-word-icon.svg' ; 
import ReplyOptionImage from "../../assets/images/reply.png" ; 
import CopyOptionImage from "../../assets/images/copy.png" ; 
import DeleteOptionImage from "../../assets/images/delete.png" ;  
import DownloadOptionImage from "../../assets/images/downloads.png" ;
import PDFOptionImage from "../../assets/images/pdf.png" 
import NotificationMessage from '../NotificationMessage' ; 

const MessageComp = props => {
  const navigate = useNavigate()

  const { item, chatSettingData, ownMessages, colonImage, groupRecieve } = props
  const id = item?.id ; 

  const handleCustomSlider = (mainData = '') => {

    return (
      <div
        className={
          mainData?.includes('.pdf') ||
          mainData?.includes('.xlsx') ||
          mainData?.includes('.doc') ||
          mainData?.includes('.docx')
            ? 'flex-column gap-3 showcard-containerimg'
            : 'showcard-containerimg'
        }
        style={
          !(
            mainData?.includes('.pdf') ||
            mainData?.includes('.xlsx') ||
            mainData?.includes('.doc') ||
            mainData?.includes('.docx')
          )
            ? {
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '10px',
                width: '232px',
                paddingBottom: '10px',
                background: 'none'
              }
            : {
                background: 'none',
                display: 'flex',
                paddingBottom: '10px'
              }
        }
      >
        <>
          {mainData?.includes('.pdf') ? (
            <div className='d-flex justify-content-between chat-file-container align-items-center'>
              <div
                className='d-flex gap-1 align-items-center'
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <img
                  className='chat-doc-image'
                  src={PdfImg}
                  alt='chatFileImg'
                />
                <div className='d-flex chat-file-name-size'>
                  <span className='text-break'>{mainData?.split('.')[0]}</span>
                </div>
              </div>
              <img
                style={{ width: '25px', height: '25px' }}
                onClick={() => saveAs(`${mainData}`)}
                src={downloadImg}
                alt='downloadImg'
              />
            </div>
          ) : mainData?.includes('.xlsx') ? (
            <div className='d-flex justify-content-between chat-file-container align-items-center'>
              <div
                className='d-flex gap-1 align-items-center'
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <img className='chat-doc-image' src={Excel} alt='chatFileImg' />
                <div className='d-flex chat-file-name-size'>
                  <span className='text-break'>{mainData?.split('.')[0]}</span>
                </div>
              </div>
              <img
                style={{ width: '25px', height: '25px' }}
                onClick={() => saveAs(`${mainData?.split('.')[0]}`)}
                src={downloadImg}
                alt='downloadImg'
              />
            </div>
          ) : mainData?.includes('.doc') || mainData?.includes('.docx') ? (
            <div className='d-flex justify-content-between chat-file-container align-items-center'>
              <div
                className='d-flex gap-1 align-items-center'
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <img className='chat-doc-image' src={Word} alt='chatFileImg' />
                <div className='d-flex chat-file-name-size'>
                  <span className='text-break'>{mainData?.split('.')[0]}</span>
                </div>
              </div>
              <img
                style={{ width: '25px', height: '25px' }}
                onClick={() => saveAs(`${mainData?.split('.')[0]}`)}
                src={downloadImg}
                alt='downloadImg'
              />
            </div>
          ) : mainData?.includes('jpg') ||
            mainData?.includes('jpeg') ||
            mainData?.includes('png') ||
            mainData?.includes('PNG') ||
            mainData?.includes('avif') ? (

            <div className='userchat-container mt-3 hw-90'>
              <img src={`${mainData}`} loading='lazy' className='hw-90'/>
            </div>

          ) : mainData?.includes('.mp4') ||
            mainData?.includes('.mov') ||
            mainData?.includes('.mkv') ? (
            <video quality={100} width='100%' height='100%'>
              <source
                src={`${item?.media}`}
              ></source>
            </video>
          ) : (
            <div className='d-flex justify-content-between chat-file-container align-items-center'>
              <div
                className='d-flex gap-1 align-items-center'
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <img
                  className='chat-doc-image'
                  src={Document}
                  alt='chatFileImg'
                />
                <div className='d-flex chat-file-name-size'>
                  <span className='text-break'>{mainData?.split('.')[0]}</span>
                </div>
              </div>
              <img
                style={{ width: '25px', height: '25px' }}
                onClick={() => saveAs(`${mainData?.split('.')[0]}`)}
                src={downloadImg}
                alt='downloadImg'
              />
            </div>
          )}
        </>
      </div>
    )
  }

  const downInternalDocFunc = (ids, data) => {
    const params = `?main_tenant_id=${ids?.split('_')[0]}&co_tenant_id=${
      ids?.split('_')[1]
    }`
    data === 'House rules sent'
      ? getCoTenantHouseRules(params)
          .then(response => {
            if (res.data.status) {
              const blob = new Blob([response?.data], {
                type: 'text/plain'
              })
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(error => {
            NotificationMessage(
              'warning',
              'Network request failed',
              err.response.data.message
            )
          })
      : getCotenantFormData(params)
          .then(response => {
            if (res.data.status) {
              const blob = new Blob([response?.data], {
                type: 'text/plain'
              })
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
            // saveAs(blob, "co-tenant-agreement.pdf")
          })
          .catch(error => {
            NotificationMessage(
              'warning',
              'Network request failed',
              err.response.data.message
            )
          })
  }

  const handleInternalDocMsg = (data, ids) => {
    return (
      <div className='d-flex justify-content-between'>
        <div
          className='d-flex gap-1 align-items-center'
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <img src={chatFileImg} alt='chatFileImg' /> 
          <span>{data}</span>
        </div>
        <img
          style={{ width: '25px', height: '25px' }}
          src={downloadImg}
          alt='chatFileImg'
          onClick={() => downInternalDocFunc(ids, data)}
        />
      </div>
    )
  }

  const handleSocialPostMsg = (data, id, platformType) => {
    return (
      <b
        onClick={() =>
          navigate('/newsocial', {
            state: {
              redirected: 'chat',
              platformType: platformType,
              collectionId: id[1]
            }
          })
        }
      >
        {data}
      </b>
    )
  }

  const handleQuotedScroll = id => {
    document.getElementById(id).scrollIntoView()
  } ; 


  const CopyTextHandling = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        NotificationMessage("success", "Copied message") ; 
      })
      .catch(err => {
          console.error('Unable to copy text: ', err);
      });
  }

  return (
    <>
      <div id={id}>

        {/* ===== Quoted message information division =====  */}

        {item?.is_quoted  && item?.is_quoted !== "False"? (
          <div className='forward-chat-message'>
            <div className='forwardChat-data'>
              <div onClick={() => handleQuotedScroll(item?.quoted_id)}>
                
                {item?.quoted_message.includes("https://")?<>

                  {item?.quoted_message.includes(".pdf")?<>
                  
                    <div className='reply-user-information-media'>
                      <span className='reply-user-span'>Reply of</span>
                      <img className='reply-chat-option-image' src={PDFOptionImage}/>
                    </div>
                  
                  </>:<>
                  
                    <div className='reply-user-information-media'>
                      <span className='reply-user-span'>Reply of</span>
                      <img className = "reply-chat-option-image" src={item?.quoted_message}/>
                    </div>
                  
                  </>}

                </>:<>
                  <p>Reply of {item?.quoted_message}</p>
                  </>}

              </div>
            </div>
            <hr />
          </div>
        ) : (
          <></>
        )}

        {/* ===== Chat message information division =====  */}

        {!groupRecieve ? (
          <>
            <div>

              {/* ==== Sender username information ====  */}

              {!ownMessages && 
                <div className='Chat-username-information'>
                    {item?.username?.username}
                </div>
              }

              <div className='userchat-data'> 

                <div style={{ flex: '1' }}>

                  {item?.media_option && handleCustomSlider(item?.media)}

                  {/* ===== Message content information =====  */}

                  <span id={id} className='text-break'>
                    {item?.is_internal_doc
                      ? handleInternalDocMsg(
                          item?.content,
                          item?.is_internal_doc
                        )
                      : item?.is_post
                      ? handleSocialPostMsg(
                          item?.content,
                          item?.content?.split('='),
                          item?.plateform_type
                        )
                      : item?.content}
                  </span>

                </div>

              </div>

            </div>

            {/* ===== Chat timestamp information ======  */}

            <div className='userchat-time'>

              {ownMessages && 
              
                <div className='message-option-division'>
                  
                  {/* ==== Reply option ====  */}

                  {!item?.is_quoted && 

                    <div className='message-option-image-division' onClick={() => chatSettingData(id, item, "reply")}>
                      <img src={ReplyOptionImage} alt="" className='message-option-image'/>
                    </div>
                  
                  }

                  {/* ==== Copy message option ====  */}

                  {!item?.media_option && 
                    <div className='message-option-image-division'
                      onClick={() => CopyTextHandling(item?.content)}>
                      <img src={CopyOptionImage} alt="" className='message-option-image'/>
                    </div>
                  }

                  {/* ==== Delete chat option ====  */}
                  
                  <div className='message-option-image-division'  onClick={() => chatSettingData(id, item, "delete")}>
                    <img src={DeleteOptionImage} alt="" className='message-option-image'/>
                  </div>

                  {/* ==== Media download option ====  */}

                  {item?.media_option && 
                  
                    <div className='message-option-image-division'>
                      <a href={item.media} download={"Download_image.jpg"} target='_blank'>
                        <img src={DownloadOptionImage} alt="" className='message-option-image'/>
                      </a>
                    </div>
                  }

                </div>
              
              }
          
              <span style={{marginLeft : 'auto'}}>
                {moment(item?.timestamp || item?.timestamp).format('hh:mm')}
              </span>
            </div>
            
          </>
        ) : (
          <></>
          )}
      </div>
    </>
  )
}

export default MessageComp
