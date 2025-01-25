import React, { useEffect, useRef, useState } from 'react'
import './Index.scss'
import moment from "moment";
import { useAppStore } from '../../../../../../store/Index';
import { apiClient } from '../../../../../../lib/api-client'
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from '../../../../../../utils/constants';
import { MdArrowBackIos, MdArrowDownward, MdFolderZip } from 'react-icons/md';
import BLANKiMAGE from '/blankProfile.png'

function MessageContainer() {
  const scrollRef = useRef();
  const { selectedChatData, selectedChatType, userInfo, selectedChatMessages, setSelectedChatMessages } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true });
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const getChannelMessages = async ()=>{
      try {
        const res = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,{ withCredentials: true })
        if(res.data.success){
          setSelectedChatMessages(res.data.messages)
        }
      } catch (error) {
        
      }
    }

    if (selectedChatData?._id && selectedChatType === 'contact') {
      getMessages();
    }else if(selectedChatData?._id && selectedChatType === 'channel'){
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages])

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath)
  }

  const downloadFile = async (url) => {
    const res = await apiClient.get(`${HOST}/${url}`, { responseType: "blob" });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob)

  }

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className='checkBorder'>
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      )
    })
  };

  const renderDMMessages = (message) => (
    <div className={`${message.sender === selectedChatData._id ? "textLeft" : "textRight"}`}>
      {message.messageType === "text" && (
        <div className={`${message.sender !== selectedChatData._id ? "recieverMessageClass" : "senderMessageClass"}`} >
          {message.content}
        </div>
      )}
      {
        message.messageType === "file" && (
          <div className={`${message.sender !== selectedChatData._id ? "recieverMessageClass" : "senderMessageClass"}`} >
            {checkIfImage(message.fileUrl) ? <div
              className=''
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }
              }>
              <img src={`${HOST}/${message?.fileUrl}`} alt="" />
            </div> :
              <div className=''>
                <span>
                  <MdFolderZip />
                </span>
                <div className='' >
                  <span>{message?.fileUrl.split('/').pop()}</span>
                  <span onClick={() => downloadFile(message.fileUrl)}>
                    <MdArrowDownward />
                  </span>
                </div>
              </div>
            }
          </div>
        )
      }
      <div className='timeColor'>{moment(message.timestamp).format("LT")} </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    return (
      <>
        <div className={`${message.sender._id !== userInfo.id ? "textLeft" : "textRight"}`}>
          {message.messageType === "text" && (
            <div className={`${message.sender._id == userInfo.id ? "recieverMessageClass" : "senderMessageClass"}`} >
              {message.content}
            </div>
          )}
          {
        message.messageType === "file" && (
          <div className={`${message.sender._id === userInfo.id ? "recieverMessageClass" : "senderMessageClass"}`} >
            {checkIfImage(message.fileUrl) ? <div
              className=''
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }
              }>
              <img src={`${HOST}/${message?.fileUrl}`} alt="" />
            </div> :
              <div className=''>
                <span>
                  <MdFolderZip />
                </span>
                <div className='' >
                  <span>{message?.fileUrl.split('/').pop()}</span>
                  <span onClick={() => downloadFile(message.fileUrl)}>
                    <MdArrowDownward />
                  </span>
                </div>
              </div>
            }
          </div>
        )
      }
          {
            message.sender._id !== userInfo.id ? <div>
              <div className="channelMessageImage">
                <div className="groupOtherMemberImageSection">
                  {console.log(message.sender)}
                  <div>
                    {
                      message?.sender?.image ? (
                        <img src={`${HOST}/${message?.sender?.image}`} alt="" />
                      ):(
                        <img src={`${BLANKiMAGE}`} alt="" />
                      )
                    }
                  </div>
                  <span>{message?.sender?.firstName}</span>
                </div>
              <div className='timeColor'>{moment(message.timestamp).format("LT")} </div>
              </div>

            </div> : <>
              <div className='timeColor'>{moment(message.timestamp).format("LT")} </div>
            </>
          }
        </div>
       </>
    )
  }

  return (
    <div className='MessageContainer'>
      <div className='MC1'>
        {renderMessages()}
        <div ref={scrollRef} />
        {
          showImage && <div className="showImage">
            <div>
              <div className='ArrowBack' onClick={() => setShowImage(false)}>
                <MdArrowBackIos /> Back
              </div>
              <div className='showKaroImage'>
                <img src={`${HOST}/${imageURL}`} alt="" />
              </div>

            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default MessageContainer