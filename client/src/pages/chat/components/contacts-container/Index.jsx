import { useEffect } from 'react'
import NewDM from './components/new-dm/Index'
import ProfileInfo from './components/profile-info/Index'
import './Index.scss'
import Logo from '/vite.svg'
import { apiClient } from '../../../../lib/api-client'
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from '../../../../utils/constants'
import { useAppStore } from '../../../../store/Index'
import ContactList from '../../../../components/Contact-List'
import CreateChannel from './components/create-channel/CreateChannel'

function ContactsContainer() { 

  const { directMessagesContacts, setDirectMessagesContacts, channels, setChannels } = useAppStore();

  useEffect(()=>{
    const getContacts = async ()=>{
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {withCredentials:true});
      if(res.data.success){
        setDirectMessagesContacts(res.data.contacts)
      }
    }
    
    const getChannels = async ()=>{
      const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {withCredentials:true});
      if(res.data.success){
        setChannels(res.data.channels)
      }
    }

    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts])

  return (
    <div className='ContactsContainer'>
      <div className='Logo'>
        <img src={Logo} alt="" />
        <span>Task Chat</span>
      </div>
      <div className='detailsBox newDMSpan'>
        <div className='newDMSpan'>
          <p>DIRECT MESSAGE</p>
          <NewDM/>
        </div>
        <div className='forExistDM'>
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className='detailsBox'>
        <div className='channelBox'>
          <p>CHANNELS</p>
          <CreateChannel/>
        </div>
        <div className='forExistDM'>
          <ContactList contacts={channels} isChannel={true}/>
        </div>
      </div>
      <div className='contactDetails'>
      </div>
      <div>
        <ProfileInfo/>
      </div>
    </div>
  )
}

export default ContactsContainer