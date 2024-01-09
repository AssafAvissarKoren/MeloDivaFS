import React from 'react';
import { useNavigate } from 'react-router-dom';
import { faSquare as farSquare, faCheckSquare, faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {emailService} from '../services/email.service'

export const EmailPreview = ({
    email,
    emailsBeingDeleted,
    onToggleStar,
    onToggleRead,
    onToggleSelect,
    onContextMenu,
    contextMenuOpen,
    contextMenuPosition,
}) => {
    const subjectPreview = email.subject.length > 50 ? `${email.subject.substring(0, 47)}...` : email.subject;
    const isBeingDeleted = emailsBeingDeleted ? emailsBeingDeleted.includes(email.id) : "";
    const emailClass = `email-preview ${isBeingDeleted ? 'animate__animated animate__bounceOut' : ''}`;
    const navigate = useNavigate();

    const handleEmailClick = async () => {
        await onToggleRead(email, false);
        const emailURL = email.folder == "drafts" ? `/email/${email.folder}/edit/${email.id}` : `/email/${email.folder}/${email.id}`;
        navigate(emailURL);
    };

    const handleStarClick = (e) => {
        e.stopPropagation();
        onToggleStar(email);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        onContextMenu(email.id, { top: e.pageY, left: e.pageX });
    };

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        onToggleSelect(email);
    };

    return (
        <div>
            <div className={emailClass} onClick={handleEmailClick} onContextMenu={handleRightClick}>
                <span onClick={handleCheckboxClick} style={{ cursor: 'pointer', marginRight: '10px' }}>
                    <FontAwesomeIcon icon={email.isChecked ? faCheckSquare : farSquare} />
                </span>
                <span onClick={handleStarClick} style={{ cursor: 'pointer', marginRight: '10px' }}>
                    {email.isStarred ? 
                        <FontAwesomeIcon icon={fasStar} style={{ color: '#f7ca4c' }}/> : 
                        <FontAwesomeIcon icon={farStar} />
                    }
                </span>
                <p className={`email-subject ${email.isRead ? 'read' : 'unread'}`} style={{ display: 'inline' }}>
                    {subjectPreview}
                </p>
            </div>
            {contextMenuOpen && (
                <div
                    className="context-menu"
                    style={{ position: 'absolute', top: contextMenuPosition.top, left: contextMenuPosition.left }}
                    onClick={() => onToggleRead(email, true)}
                >
                    {email.isRead ? 'Mark as Unread' : 'Mark as Read'}
                </div>
            )}
        </div>
    );
};
