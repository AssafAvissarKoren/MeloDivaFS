import { useEffect, useState, useContext } from 'react';
import { EmailPreview } from './EmailPreview';
import { emailService } from '../services/email.service';
import { useSearchParams } from 'react-router-dom';
import { EmailContext } from './EmailContext';
import { utilService } from '../services/util.service';

export const EmailList = () => {
    const { filteredEmails, setFilterBy, handleEmailSelect } = useContext(EmailContext);
    const [emailList, setEmailList] = useState(filteredEmails);
    const [contextMenu, setContextMenu] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortCriterion, setSortCriterion] = useState('');

    useEffect(() => {
        setEmailList(filteredEmails);
    }, [sortCriterion, filteredEmails]);

    const handleSortChange = (e) => {
        setSortCriterion(e.target.value);
    };

    useEffect(() => {
        const isRead = searchParams.get('isRead');
        const sort = searchParams.get('sort');

        setFilterBy(prev => ({ ...prev, isRead: isRead === 'true' ? true : isRead === 'false' ? false : null }));
        setSortCriterion(sort || '');
    }, [searchParams]);

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

    const onToggleStar = async (email) => {
        const updatedEmail = { ...email, isStarred: !email.isStarred }
        await emailService.saveEmail(updatedEmail);
        setEmailList(emailList.map(e => e.id === updatedEmail.id ? updatedEmail : e));
        setFilterBy(prevFilter => ({ ...prevFilter }))
    };

    const onToggleRead = async (email, isContextMenu = false) => {
        let updatedEmail = email
        if (isContextMenu || (!isContextMenu && !email.isRead)) {
            updatedEmail = { ...email, isRead: !email.isRead }
        } 
        await emailService.saveEmail(updatedEmail, updatedEmail.folder);
        setEmailList(emailList.map(e => e.id === updatedEmail.id ? updatedEmail : e));
        setContextMenu(null);
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
            <select onChange={handleSortChange} value={sortCriterion}>
                <option value="">Sort By</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
            </select>
            {emailList.map(email => (
                <EmailPreview
                    key={email.id}
                    email={email}
                    onSelectEmail={() => handleEmailSelect(email.id)}
                    onToggleStar={() => onToggleStar(email)}
                    onToggleRead={onToggleRead}
                    onContextMenu={handleContextMenu}
                    contextMenuOpen={contextMenu?.emailId === email.id}
                    contextMenuPosition={contextMenu?.position}
                />
            ))}
        </div>
    );
};
