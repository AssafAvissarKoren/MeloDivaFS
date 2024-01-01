import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';
import { eventBusService, showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { EmailModal } from '../cmps/EmailModal';
import { utilService } from '../services/util.service';
import { EmailContext } from './EmailContext';

export const EmailDetails = () => {
    const [email, setEmail] = useState(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const { indexEmailsList } = useContext(EmailContext); // Destructure setLength from context
    const params = useParams();
    const navigate = useNavigate();

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
    const detailsDDRef = useRef(null);
    const moreOptionsDDRef = useRef(null);

    useEffect(() => {
        const loadEmail = async () => {
            try {
                const email = indexEmailsList.find(listEmail => listEmail.id === params.emailId)
                let updatedEmail = {...email, isRead: true}
                await emailService.saveEmail(updatedEmail, updatedEmail.folder);
                setEmail(updatedEmail);
            } catch (error) {
                console.error('Error loading email:', error);
            }
        };
        loadEmail();
    }, [params.emailId]);

    const onDeleteEmail = async (email) => {
        try {
            if(params.folder === "trash") {
                await emailService.remove(email.id);
                showSuccessMsg('Email deleted successfully')
            } else {
                await emailService.saveEmail(email, "trash");
                showSuccessMsg('Email moved to Trash folder successfully')
            }
            eventBusService.emit('email-deleted', { type: 'success', txt: 'Email deleted successfully' });
            emailService.backOneURLSegment(navigate);
        } catch (error) {
            console.error('Error deleting email:', error);
            eventBusService.emit('email-deleted', { type: 'error', txt: 'Could not delete email' })
            showErrorMsg('Could not delete email')
        }
    };

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

    const moreOptionsContent = (
        <div className="modal-content">
            <div className="modal-option"><i className="fas fa-envelope-open-text"></i><span className="option-text">Mark as not important</span></div>
            <div className="modal-option"><i className="fas fa-star"></i><span className="option-text">Add star</span></div>
            <div className="modal-option"><i className="fas fa-calendar-plus"></i><span className="option-text">Create event</span></div>
            <div className="modal-option"><i className="fas fa-filter"></i><span className="option-text">Filter messages like these</span></div>
            <div className="modal-option"><i className="fas fa-volume-mute"></i><span className="option-text">Mute</span></div>
            <div className="modal-option"><i className="fas fa-highlighter"></i><span className="option-text">Turn off highlighting</span></div>
        </div>
    );

    const openModal = async (elementRef, setShowModal) => {
        if (elementRef.current) {
            const rect = await elementRef.current.getBoundingClientRect();
            const newPosition = {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
            };
            setPosition(newPosition); // Set position for both modals
            setShowModal(true);
        }
    };

    const navigateToEmail = async (emailId) => {
        if (emailId) {
            if (email) {
                navigate(`/email/${email.folder}/${emailId}`);
            }
        }
    };

    if (!email) {
        return <div>Loading email...</div>;
    }

    return (
        <div className="email-details">           
            <div className="email-action-buttons">
                <button className="archive" title="archive"><i className="fas fa-archive"></i></button>
                <button className="report-spam" title="report spam"><i className="fas fa-exclamation-circle"></i></button>
                <button className="delete" title="delete" onClick={() => onDeleteEmail(email)}><i className="fas fa-trash-alt"></i></button>
                <button className="mark-as-unread" title="mark as unread"><i className="fas fa-envelope-open-text"></i></button>
                <button className="snooze" title="snooze"><i className="fas fa-clock"></i></button>
                <button className="add-to-tasks" title="add to tasks"><i className="fas fa-tasks"></i></button>
                <button className="move-to" title="move to"><i className="fas fa-folder"></i></button>
                <button className="labels" title="labels"><i className="fas fa-tag"></i></button>
                <button className="more" ref={moreOptionsDDRef} onClick={() => openModal(moreOptionsDDRef, setShowMoreOptionsModal)}>
                {/* openMoreOptionsModal */}
                    <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                </button>
                <span>{email.listIndex} of {indexEmailsList ?  indexEmailsList.length : 0}</span>
                <button 
                    disabled={!email.prevEmailId}
                    onClick={async () => await navigateToEmail(email.prevEmailId)}>
                    <i className="fa fa-chevron-left"></i> Previous
                </button>

                <button 
                    disabled={!email.nextEmailId}
                    onClick={() => navigateToEmail(email.nextEmailId)}>
                    Next <i className="fa fa-chevron-right"></i>
                </button>
            </div>
            <h2>{email.subject}</h2>
            <p className="email-from">From: {email.from}</p>
            <div className="email-to-and-time">
            <p className="email-to">To me<span ref={detailsDDRef} className="dropdown-icon" onClick={() => openModal(detailsDDRef, setShowDetailsModal)}>▼</span></p> 
            {/* openDetailsModal */}
                <EmailModal
                    isOpen={showDetailsModal}
                    content={detailsContent}
                    onClose={() => setShowDetailsModal(false)}
                    position={position}
                />
                <EmailModal
                    isOpen={showMoreOptionsModal}
                    content={moreOptionsContent}
                    onClose={() => setShowMoreOptionsModal(false)}
                    position={position}
                />
            </div>
            <div className="email-body">{email.body}</div>
            <button className="email-action-button">Reply</button>
            <button className="email-action-button">Forward</button>
        </div>
    );
};

