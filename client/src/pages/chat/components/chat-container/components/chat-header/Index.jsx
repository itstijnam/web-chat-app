import React from 'react'
import { RiCloseFill} from 'react-icons/ri';
import './Index.scss'
import { useAppStore } from '../../../../../../store/Index';
import {HOST} from '../../../../../../utils/constants'

function ChatHeader() {
  const {closeChat, selectedChatData, selectedChatType} = useAppStore();
  return (
    <div className='ChatHeader'>
        <div className='CH1'>
          {
            selectedChatType === "contact" ? 
            <div className='CH11'>
              <div className="Image">
                <img className="insideImage" src={`${HOST}/${selectedChatData.image}`} alt="" />
              </div>
              <div className="userName">
                <p className='firstName'>{selectedChatData.firstName} {selectedChatData.lastName}</p>
                <span>{selectedChatData.email}</span>
              </div>
            </div> : <div className='CH11'>
              <div className="Image">
                <img className="insideImage" src={`${HOST}/${selectedChatData.image}`} alt="" />
              <div>CN</div>
              </div>
              <div className="userName">
                <p className='firstName'>{selectedChatData.name}</p>
              </div>
            </div>
          }
            <div>
                <button className='' onClick={closeChat}>
                    <RiCloseFill/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ChatHeader