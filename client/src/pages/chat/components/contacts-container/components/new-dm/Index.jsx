import React, { useState } from 'react'
import './Index.css'
import { useAppStore } from '../../../../../../store/Index'
import { HOST, SEARCH_CONTACTS_ROUTES } from '../../../../../../utils/constants';
import { apiClient } from '../../../../../../lib/api-client';

function NewDM() {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModel, setOpenNewContactModel] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([]);
    const { message, setMessage } = useState('')
    const { userInfo } = useAppStore();
    const newContactDialogueHandler = () => {
        setOpenNewContactModel(!openNewContactModel)
    }

    const searchContacts = async (searchTerm) => {
        try {
            if (searchContacts.length > 0 && { ...searchContacts, profileSetup: true }) {
                const res = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm }, { withCredentials: true })
                if (res.status === 200 && res.data.contacts) {
                    const filteredContacts = res.data.contacts.filter(contact => contact.profileSetup === true);
                    setSearchedContacts(filteredContacts);
                }
            } else {
                setSearchedContacts([])
            }
        } catch (error) {
            console.log(error)
            setMessage(error?.response?.data?.message)
        }
    }

    const selectNewContact = (contact)=>{
        setOpenNewContactModel(false);
        setSelectedChatData(contact);
        setSelectedChatType("contact")
        setSearchedContacts([]);

    }

    return (
        <div className='newDM'>
            <div onClick={newContactDialogueHandler} className='plusIcon'>
                +
            </div>
            {
                openNewContactModel &&
                <div className='dialogueBox'>
                    <div className='searchNewUser'>
                        <input type="text" className='dialogueInput' onChange={(e) => searchContacts(e.target.value)} placeholder='Search New Contact' />
                        <button className='newUserSearchBtn'>Search</button>
                    </div>
                    {
                        searchedContacts?.map((contact, i) => {
                            return (
                                <div className='newUserDisplay' key={i} 
                                    onClick={()=>selectNewContact(contact)}
                                >
                                    <div className="userImage">
                                        <img src={`${HOST}/${contact?.image}`} alt="" />
                                    </div>
                                    <div className="userName">
                                        {contact?.firstName}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default NewDM