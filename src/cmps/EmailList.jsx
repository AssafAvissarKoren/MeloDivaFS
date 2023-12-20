import { useEffect, useState } from 'react';
import { EmailPreview } from './EmailPreview';
import { emailService } from '../services/email.service';

export const EmailList = ({ emails, handleEmailSelect }) => {
    const [emailList, setEmailList] = useState(emails);
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        setEmailList(emails);
    }, [emails]);

    useEffect(() => {
        // Handler to close context menu on outside clicks
        const handleOutsideClick = (e) => {
          if (contextMenu) {
            if (!e.target.closest('.email-preview') && !e.target.closest('.context-menu')) {
              setContextMenu(null);
            }
          }
        };
      
        // Attach event listener
        document.addEventListener('mousedown', handleOutsideClick);
      
        // Clean up
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [contextMenu]);

    const onToggleStar = async (emailId) => {
        const updatedEmails = emailList.map(email => {
            if (email.id === emailId) {
                return { ...email, isStarred: !email.isStarred };
            }
            return email;
        });

        emailService.updateStarFolder(updatedEmails, emailId);
        setEmailList(updatedEmails);
    };

    const onMarkAsUnread = async (emailId) => {
        const updatedEmails = await emailService.markAsUnread(emailId);
        setEmailList(updatedEmails);
    };

    const onMarkAsRead = async (emailId) => {
        const updatedEmails = await emailService.markAsRead(emailId);
        setEmailList(updatedEmails);
    };

    const handleContextMenu = (emailId, position) => {
        if (contextMenu && contextMenu.emailId === emailId) {
            setContextMenu(null);
        } else {
            setContextMenu({ emailId, position });
        }
    };
    
    return (
        <div className="email-list">
            {emails.map(email => (
                <EmailPreview
                    key={email.id}
                    email={email}
                    onSelectEmail={() => handleEmailSelect(email.id)}
                    onToggleStar={onToggleStar}
                    onMarkAsUnread={onMarkAsUnread}
                    onMarkAsRead={onMarkAsRead}
                    onContextMenu={handleContextMenu}
                    contextMenuOpen={contextMenu?.emailId === email.id}
                    contextMenuPosition={contextMenu?.position}
                />
            ))}
        </div>
    );
};
