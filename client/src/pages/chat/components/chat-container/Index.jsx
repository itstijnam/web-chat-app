import ChatHeader from './components/chat-header/Index'
import MessageBar from './components/message-bar/Index'
import MessageContainer from './components/message-container/Index'
import './Index.scss'

function ChatContainer() {
  return (
    <div className='ChatContainer'>
       <ChatHeader/>
       <MessageContainer/>
       <MessageBar/>
    </div>
  )
}

export default ChatContainer