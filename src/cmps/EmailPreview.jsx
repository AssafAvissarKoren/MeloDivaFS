import React from 'react';
import '../assets/css/cmps/email-preview.css';

export const EmailPreview = ({
    email,
    onSelectEmail,
    onToggleStar,
    onMarkAsUnread,
    onMarkAsRead,
    onContextMenu,
    contextMenuOpen,
    contextMenuPosition
}) => {
    const subjectPreview = email.subject.length > 50 ? `${email.subject.substring(0, 47)}...` : email.subject;

    const handleEmailClick = () => {
        onSelectEmail(email);
    };

    const handleStarClick = (e) => {
        e.stopPropagation();
        onToggleStar(email.id);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        onContextMenu(email.id, { top: e.pageY, left: e.pageX });
    };

    const handleMarkAsReadUnread = () => {
        if (email.isRead) {
            onMarkAsUnread(email.id);
        } else {
            onMarkAsRead(email.id);
        }
    };

    return (
        <div>
            <div className="email-preview" onClick={handleEmailClick} onContextMenu={handleRightClick}>
                <span onClick={handleStarClick} style={{ cursor: 'pointer', marginRight: '10px' }}>
                    {email.isStarred ? '⭐' : '☆'}
                </span>
                <p className={`email-subject ${email.isRead ? 'read' : 'unread'}`} style={{ display: 'inline' }}>
                    {subjectPreview}
                </p>
            </div>
            {contextMenuOpen && (
                <div
                    className="context-menu"
                    style={{ position: 'absolute', top: contextMenuPosition.top, left: contextMenuPosition.left }}
                    onClick={handleMarkAsReadUnread}
                >
                    {email.isRead ? 'Mark as Unread' : 'Mark as Read'}
                </div>
            )}
        </div>
    );
};
