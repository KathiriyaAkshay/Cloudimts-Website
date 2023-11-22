import React, { useEffect } from 'react'
import { saveAs } from 'file-saver'
import { useNavigate } from 'react-router'
import moment from 'moment/moment'
import ChatSettingPop from './ChatSettingPop'
import PdfImg from '../../assets/images/pdf.svg'
import downloadImg from '../../assets/images/download-chat-img.png'
import Excel from '../../assets/images/microsoft-excel-icon.svg'
import Document from '../../assets/images/Document_chat.svg'
import chatFileImg from '../../assets/images/chat-file-icon.svg'
import Word from '../../assets/images/microsoft-word-icon.svg'
const MessageComp = props => {
  const navigate = useNavigate()

  const { item, chatSettingData, ownMessages, colonImage, groupRecieve } = props
  const id = item?.id
  const { media } = item || []

  console.log('Ownmessage information ==========>')
  console.log(ownMessages)

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
            <div className='userchat-container mt-3'>
              <img src={`${mainData}`} />
            </div>
          ) : mainData?.includes('.mp4') ||
            mainData?.includes('.mov') ||
            mainData?.includes('.mkv') ? (
            <video quality={100} width='100%' height='100%'>
              <source
                // type={`video/${mainData[0]?.files?.split(".")?.pop()}`}
                src={`${mainData}`}
              ></source>
            </video>
          ) : (
            // <Slider
            //   imageData={mainData}
            //   numberShowMargin={true}
            //   handleGalleryPopUp={handleGalleryPopUp}
            //   isMessageGallery={true}
            // />
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
  }

  return (
    <>
      <div id={id}>
        {item?.is_quoted ? (
          <div className='forward-chat-message'>
            <div className='forwardChat-data'>
              <div onClick={() => handleQuotedScroll(item?.quoted_id)}>
                <i style={{ marginBottom: '6px' }}>❝ Quoted ❞ :</i>
                <p>{item?.quoted_message}</p>
              </div>
              <img
                alt='img'
                src={colonImage}
                onClick={() => chatSettingData(id)}
                style={{ cursor: 'pointer' }}
              ></img>
            </div>
            <hr />
          </div>
        ) : (
          <></>
        )}

        {!groupRecieve ? (
          <>
            <div>
              <div className='Chat-username-information'>KeyurVaghasiya</div>

              <div className='userchat-data'>
                <div style={{ flex: '1' }}>
                  {item?.media_option &&
                    handleCustomSlider(
                      item?.is_forwarded ? item?.file_url : media
                    )}

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

                {!item?.is_forwarded && !item?.is_quoted ? (
                  <img
                    alt='img'
                    src={colonImage}
                    style={{ cursor: 'pointer' }}
                    className='option-menu-image'
                    onClick={() => chatSettingData(id)}
                  ></img>
                ) : (
                  ''
                )}
              </div>
            </div>

            {/* ===== Chat timestamp information ======  */}

            <div className='userchat-time'>
              <span>
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
