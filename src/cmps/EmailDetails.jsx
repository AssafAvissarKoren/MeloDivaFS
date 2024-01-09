import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';
import { EmailModal } from '../cmps/EmailModal';
import { EmailContext } from './EmailContext';
import { EmailActionButtons } from './EmailActionButtons';
import { EmailNavButtons } from './EmailNavButtons'
import { EmailMap } from './EmailMap';
import { useNavigate } from 'react-router-dom';

export const EmailDetails = () => {
    const [email, setEmail] = useState(null);
    const { indexEmailList, setIndexEmailList, setFilterBy } = useContext(EmailContext);
    const params = useParams();
    const navigate = useNavigate();

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const detailsDDRef = useRef(null);

    const location = email?.location;

    useEffect(() => {
        const loadEmail = async () => {
            try {
                const email = indexEmailList.find(listEmail => listEmail.id === params.emailId)
                let updatedEmail = {...email, isRead: true}
                await emailService.saveEmail(updatedEmail, updatedEmail.folder);
                setEmail(updatedEmail);
            } catch (error) {
                console.error('Error loading email:', error);
            }
        };
        loadEmail();
    }, [params.emailId]);

    const detailsContent = (
        <div className="modal-content">
            <p>From: {email?.from}</p>
            <p>To: {email?.to}</p>
            <p>Date: {email && new Date(email.sentAt).toLocaleString()}</p>
            <p>Subject: {email?.subject}</p>
            <p>Mailed-by: {null}</p>
            <p>Signed-by: {null}</p>
            <p>Security: {null}</p>
        </div>
    );

    const handleSingleMove = async (email, folder) => {
        await emailService.saveEmail(email, folder);
        setIndexEmailList(prevEmails => prevEmails.map(prevEmail => prevEmail.id == email.id ? email : prevEmail));
        setFilterBy(prevFilter => ({ ...prevFilter }));
        navigate(`/email/${email.folder}`);    
    }

    const handleSingleRead = async (email, markAsRead) => {
        const updatedEmail = {...email, isRead: markAsRead};
        await emailService.saveEmail(updatedEmail, updatedEmail.folder);
        setIndexEmailList(prevEmails => prevEmails.map(prevEmail => prevEmail.id == updatedEmail.id ? updatedEmail : prevEmail));
    }

    if (!email) {
        return <div>Loading email...</div>;
    }

    return (
        <div className="email-details">
            <div className="action-bar">
                <div className="start-buttons">
                </div>
                <EmailActionButtons 
                    emails={[email]}
                    handleMove={handleSingleMove}
                    handleRead={handleSingleRead}
                />
                <EmailNavButtons email={email} emailListLength={indexEmailList.length}/>
            </div>
            <h2>{email.subject}</h2>
            <p className="email-from">From: {email.from}</p>
            <div className="email-to-and-time">

            <p className="email-to">To me<span ref={detailsDDRef} className="dropdown-icon">▼</span></p>
            <EmailModal
                triggerRef={detailsDDRef}
                content={detailsContent}
                onClose={() => setShowDetailsModal(false)}
            />
            </div>
            {/* <div className="email-body" dangerouslySetInnerHTML={createMarkup(email.body)}></div>  */} {/* CRQ any better way than dangerouslySetInnerHTML?*/}
            <div className="email-body"><pre>{email.body}</pre></div>
            <button className="email-action-button">Reply</button>
            <button className="email-action-button">Forward</button>
            <EmailMap location={location}/>
        </div>
    );
};

