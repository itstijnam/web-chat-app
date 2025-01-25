import React, { useEffect, useRef, useState } from 'react'
import './Index.scss'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from "emoji-picker-react"
import { useAppStore } from '../../../../../../store/Index'
import { useSocket } from '../../../../../../context/SocketContext'
import { apiClient } from '../../../../../../lib/api-client'
import { UPLOAD_FILE_ROUTE } from '../../../../../../utils/constants'

function MessageBar() {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const {selectedChatType, selectedChatData, userInfo} = useAppStore();
  const [message, setMessage] = useState('')
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji)=>{
    setMessage((msg)=> msg + emoji.emoji);
  }

  const handleAttachmentClick = ()=>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async (event)=>{
    try {
      const file = event.target.files[0];
      if(file){
        console.log(`file ->`, file)
        const formData = new FormData();
        formData.append("file", file);
        console.log(`form data -> `, formData);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {withCredentials: true});
        if(res.status===200 && res.data){
          if(selectedChatType === "contact"){
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            })
          } else if(selectedChatType === "channel"){
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId:  selectedChatData._id,
            })
          }
        }
      }
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  const handleSendMessage = async ()=>{
    setMessage('')
    if(selectedChatType === "contact"){
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient:  selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    } else if(selectedChatType === "channel"){
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      })
    }
  }

  return (
    <div className='MessageBar'>
      <div className='MB1'>
        <input
          type="text"
          placeholder="Enter Message"
          className=''
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className='attachment'>
          <button onClick={handleAttachmentClick}>
            <GrAttachment />
          </button>
          <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />
          <button onClick={()=>setEmojiPickerOpen(true)}>
            <RiEmojiStickerLine />
          </button>
          <div className='emojiPicker' ref={emojiRef}>
            <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          </div>
        </div>
      </div>
      <div className='msgSend'>
        <button onClick={handleSendMessage}>
          <IoSend className='iosend'/>
        </button>
      </div>
    </div>
  )
}

export default MessageBar