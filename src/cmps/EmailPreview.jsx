import React from 'react';
import { faSquare as farSquare, faCheckSquare, faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const EmailPreview = ({
    email,
    onSelectEmail,
    onToggleStar,
    onToggleRead,
    onToggleSelect,
    onContextMenu,
    contextMenuOpen,
    contextMenuPosition,
}) => {
    const subjectPreview = email.subject.length > 50 ? `${email.subject.substring(0, 47)}...` : email.subject;

    const handleEmailClick = () => {
        onToggleRead(email, false);
        onSelectEmail(email);
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
            <div className="email-preview" onClick={handleEmailClick} onContextMenu={handleRightClick}>
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
