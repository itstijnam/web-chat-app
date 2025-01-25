import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/Index'
import './Index.scss'
import { useEffect } from 'react'
import ContactsContainer from './components/contacts-container/Index';
import EmptyChatContainer from './components/empty-chat-container/Index';
import ChatContainer from './components/chat-container/Index';


function Chat() {
  const {userInfo, selectedChatType, selectedChatData, isUploading,isDownloading, fileUploadProgress, fileDownloadProgress, } = useAppStore();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!userInfo?.profileSetup){
      navigate('/profile');
    }
  },[userInfo, navigate]);
  return (
    <div className='Chat'>
      <ContactsContainer/>
      {
        selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/>
      }
    </div>
  )
}

export default Chat