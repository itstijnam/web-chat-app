import React from 'react'
import { useAppStore } from '../store/Index'
import './ui/uiCss/Contact-list.css'
import { HOST } from '../utils/constants';

function ContactList({ contacts, isChannel = false }) {

    const {
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        selectedChatType,
        setSelectedChatMessages
    } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    }

    return (
        <div className='ContactList'>
            {contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`CL1 ${selectedChatData & (selectedChatData?._id === contact._id) ? "selectedChatContainer" : "unselectedChatContainer"}`}
                    onClick={() => handleClick(contact)}
                >
                    {
                        !isChannel &&
                        <div className='CL1-1'>
                            {
                                !isChannel && (
                                    <>
                                        <div className="CL1-1-Image">
                                            {contact.image ? (
                                                <img src={`${HOST}/${contact.image}`} alt="" />
                                            ) : (
                                                <div>CN</div>
                                            )

                                            }
                                        </div>
                                    </>
                                )
                            }
                            <div className='CL1-1-firstName'> {contact?.firstName} </div>
                        </div>
                    }
                    {
                        isChannel &&
                        <div className='CL1-1'>
                            {
                                isChannel && (
                                    <>
                                        <div className="CL1-1-Image">
                                            {contact.image ? (
                                                <img src={`${HOST}/${contact.image}`} alt="" />
                                            ) : (
                                                <div>CN</div>
                                            )

                                            }
                                        </div>
                                    </>
                                )
                            }
                            <div className='CL1-1-firstName'> {contact?.name} </div>
                        </div>
                    }
                </div>
            ))
            }
        </div>
    )
}

export default ContactList