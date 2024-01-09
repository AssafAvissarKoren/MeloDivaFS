import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';
import { statsService } from '../services/stats.service';
import { eventBusService } from "../services/event-bus.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faStar, faPaperPlane, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

export const EmailSideNav = ({ setFilterBy, onComposeClick, loadEmails }) => {
    const params = useParams();
    const folder = params.folder
    const stats = statsService.getStats()

    useEffect(() => {
        setFilterBy(prev => ({ ...prev, folder }));
    }, [folder, setFilterBy]);

    const folderData = {
        inbox: { total: stats.Inbox?.total || 0, unread: stats.Inbox?.unread || 0, icon: faInbox },
        starred: { total: stats.Starred?.total || 0, unread: stats.Starred?.unread || 0, icon: faStar },
        sent: { total: stats.Sent?.total || 0, unread: stats.Sent?.unread || 0, icon: faPaperPlane },
        drafts: { total: stats.Drafts?.total || 0, unread: stats.Drafts?.unread || 0, icon: faPencilAlt },
        trash: { total: stats.Trash?.total || 0, unread: stats.Trash?.unread || 0, icon: faTrash },
    };


    const handleFolderSelect = (selectedFolder) => {
        setFilterBy(prev => ({ ...prev, folder: selectedFolder }));
    };

    const resetEmails = async () => {
        try {
            await emailService.initEmails();
            setFilterBy(emailService.getDefaultFilter(params));
            loadEmails();
            eventBusService.showSuccessMsg('Emails reset successfully');
        } catch (error) {
            console.error('Error resetting emails:', error);
            eventBusService.showErrorMsg('Could not reset emails');
        }
    };
    
    return (
        <div className="email-side-nav">
            <button onClick={resetEmails} style={{ margin: '10px' }}>Reset Emails</button>
            <button onClick={onComposeClick} className="compose-btn">
                <FontAwesomeIcon icon={faPencilAlt} aria-hidden="true" /> Compose Email
            </button>
            {Object.entries(folderData).map(([key, { total, unread, icon }]) => {
                return (
                    <div
                        key={key}
                        onClick={() => handleFolderSelect(key)}
                        className={key === folder ? 'active' : ''}
                    >
                        <span>
                            <FontAwesomeIcon icon={icon} className="icon-style" aria-hidden="true" />
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        </span>
                        <span style={{ marginLeft: '10px' }}>({unread}/{total})</span>
                    </div>
                );
            })}
        </div>
    );
};
