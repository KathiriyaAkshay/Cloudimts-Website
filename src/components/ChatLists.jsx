import React, { useEffect, useState } from 'react'
import ProfileImage from '../assets/images/ProfileImg.png'
import UrgentCase from '../assets/images/urgentCase.png'
import NormalCase from '../assets/images/normalCase.png'
import { Divider, Typography, Empty } from 'antd'
import { getAllChatList } from '../apis/studiesApi'
import NotificationMessage from './NotificationMessage'
import { convertToDDMMYYYY } from '../helpers/utils'

const ChatLists = ({ setSeriesId, setStudyId, setPersonName, studyId, setUrgentCase }) => {
  const [chatListData, setChatListData] = useState([])

  useEffect(() => {
    retrieveChatListData()
  }, [])

  // *** Retervie chatlist informaton *** // 
  const retrieveChatListData = () => {
    getAllChatList({
      current_timestamp: Date.now()
    })
      .then(res => {
        if (res.data.status) {

          // Configure Room ChatTimestamp

          const chatLatestTime = {}
          res['data']['room_timestamp'].forEach(timeStampInfo => {
            chatLatestTime[timeStampInfo.room_id] =
              timeStampInfo.latest_timestamp
          })

          const resData = res.data.data.map(data => (

            // console.log(data)

            {
              ...data,
              room_id: data.room.id,
              name: `${data.room.study.patient.patient_id} | ${data.room.study.patient.patient_name}`,
              modality: data.room.study.modality,
              status: data.room.study.status,
              urgent_case: data.room.study.urgent_case,
              study_id: data.room.study.id,
              series_id: data.room.study.series_id,
              profile: ProfileImage,
              latest_timestamp: chatLatestTime[data.room.id] || null
            }

          ))

          const sortedData = resData.sort((a, b) => {
            const timestampA = new Date(a.latest_timestamp || '1970-01-01'); // Assuming default date is '1970-01-01'
            const timestampB = new Date(b.latest_timestamp || '1970-01-01');

            return timestampB - timestampA; // Sort as Date objects in descending order
          });

          setChatListData([...sortedData])

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

  return (
    <div className='chat-list-main-div'>
      <div>
        <div className='chat-list-title-div'>
          <Typography
            className='chat-list-name'
            style={{ fontSize: '16px', color: '#FFFFFF' }}
          >
            Chats
          </Typography>
        </div>
        <Divider
          style={{
            margin: '0px 0px',
            borderBlockStart: '1px solid rgba(255, 255, 255, 0.4)'
          }}
        />
      </div>
      <div className='all-chat-list'>
        {chatListData?.map(data => (
          <>
            <div
              key={data.study_id}
              className={`chat-list-div ${studyId == data.study_id && `chat-list-div-active`
                }`}
              onClick={() => {
                setSeriesId(data.series_id)
                setStudyId(data.study_id)
                setPersonName(data.name)
                setUrgentCase(data.urgent_case)
              }}
            >
              <div className='study-chat-userdata'>
                {data.urgent_case ? (
                  <>
                    <img
                      src={UrgentCase}
                      alt={data.name}
                      className='study-chat-image'
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={NormalCase}
                      alt={data.name}
                      className='study-chat-image'
                    />
                  </>
                )}

                <div className='study-chat-data w-100'>
                  <Typography className='chat-list-name'>
                    {data.name}
                  </Typography>

                  <div className='study-description-data'>
                    <div className='chats-modality-status'>
                      <Typography
                        className='particular-study-chat-description'
                        style={{ fontSize: '12px' }}
                      >
                        <div className='chats-study-id'>
                          <span style={{ fontWeight: 600 }}>
                            StudyId -{' '}
                          </span>
                          {data.id}
                        </div>
                      </Typography>
                      <Typography
                        className='particular-study-chat-description'
                        style={{ fontSize: '12px' }}
                      >
                        <div className='chats-study-modality'>
                          <span style={{ color: '#A6A6A6', fontWeight: 600 }}>
                            Modality -{' '}
                          </span>
                          {data.modality}
                        </div>
                      </Typography>


                    </div>
                    <Typography
                      className='particular-study-chat-description'
                      style={{ fontSize: '12px' }}
                    >
                      <span style={{ color: '#A6A6A6', fontWeight: 600 }}>
                        Status -{' '}
                      </span>
                      {data.status}
                    </Typography>


                    {data.latest_timestamp !== null ? (
                      <>
                        <div className='Latest-timestamp-info-layout'>
                          <Typography
                            className='particular-study-chat-description'
                            style={{ fontSize: '12px' }}
                          >
                            <span style={{ color: '#A6A6A6', fontWeight: 600 }}>
                              Latest chat -{' '}
                            </span>
                            {convertToDDMMYYYY(data.latest_timestamp)}
                          </Typography>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}

        {chatListData?.length == 0 && (
          <Empty
            style={{marginTop: 30}}
            description = "Not found any chat within 10 days"
          />
        )}
      </div>
    </div>
  )
}

export default ChatLists
