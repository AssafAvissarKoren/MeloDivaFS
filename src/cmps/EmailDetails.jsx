import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';

export const EmailDetails = () => {
    const [email, setEmail] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const dropdownRef = useRef(null);
    const params = useParams()
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    
    useEffect(() => {
        loadEmail()
    }, [params.emailId]);

    async function loadEmail() {
        try {
            const email = await emailService.getById(params.emailId)
            setEmail(email)
        } catch (error) {
            console.log('error:', error)
        }
    }

    async function onDeleteEmail(email) {
        if(params.folder == "trash") {
            await emailService.remove(email.id)
        } else {
            await emailService.saveEmail(email, "trash");
        }
        emailService.backOneURLSegment(navigate);
    }

    function toggleDetails(event) {
        if (!showDetails) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setShowDetails(true);
            setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        } else {
            setShowDetails(false);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (showDetails && modalRef.current && !modalRef.current.contains(event.target)) {
                setShowDetails(false);
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDetails]);
    
    
    if (!email) {
        return <div>Loading email...</div>;
    }

    return (
        <div className="email-details">
            <button onClick={() => emailService.backOneURLSegment(navigate)}>Back to list</button>
            <h2>{email.subject}</h2>
            <p className="email-from">From: {email.from}</p>
            <div className="email-to-and-time">
                <p className="email-to">To me <span ref={dropdownRef} className="dropdown-icon" onClick={toggleDetails}>▼</span></p>

                {showDetails && (
                    <div className="modal" ref={modalRef} style={{ top: `${position.top}px`, left: `${position.left}px` }}>
                        <div className="modal-content">
                            <span className="close-button" onClick={toggleDetails}>&times;</span>
                            <p>From: {email.from}</p>
                            <p>To: {email.to}</p>
                            <p>Date: {new Date(email.sentAt).toLocaleString()}</p>
                            <p>Subject: {email.subject}</p>
                            <p>Mailed-by: {null}</p>
                            <p>Signed-by: {null}</p>
                            <p>Security: {null}</p>
                        </div>
                    </div>
                )}
                <p className="email-time">{new Date(email.sentAt).toLocaleString()}</p>
            </div>
            <div className="email-body">{email.body}</div>
            <button className="email-action-button">Reply</button>
            <button className="email-action-button">Forward</button>
        </div>
    );
};
