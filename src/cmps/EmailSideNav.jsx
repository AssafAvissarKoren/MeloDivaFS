import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';
import { eventBusService, showErrorMsg, showSuccessMsg } from "../services/event-bus.service";

export const EmailSideNav = ({ emails, setFilterBy }) => {
    const navigate = useNavigate();
    const params = useParams();
    const folder = params.folder

    useEffect(() => {
        setFilterBy(prev => ({ ...prev, folder }));
    }, [folder, setFilterBy]);

    const folderData = {
        inbox: { count: emails.filter(email => email.folder === 'inbox').length, icon: 'fa fa-inbox' },
        starred: { count: emails.filter(email => email.isStarred).length, icon: 'fa fa-star' },
        sent: { count: emails.filter(email => email.folder === 'sent').length, icon: 'fa fa-paper-plane' },
        drafts: { count: emails.filter(email => email.folder === 'drafts').length, icon: 'fa fa-pencil-alt' },
        trash: { count: emails.filter(email => email.folder === 'trash').length, icon: 'fa fa-trash' },
    };

    const handleFolderSelect = (selectedFolder) => {
        setFilterBy(prev => ({ ...prev, folder: selectedFolder }));
    };

    const resetEmails = async () => {
        try {
            await emailService.initEmails();
            setFilterBy(emailService.getDefaultFilter(params));
            eventBusService.emit('emails-reset', { type: 'success', txt: 'Emails reset successfully' });
            showSuccessMsg('Emails reset successfully');
        } catch (error) {
            console.error('Error resetting emails:', error);
            eventBusService.emit('emails-reset', { type: 'error', txt: 'Could not reset emails' });
            showErrorMsg('Could not reset emails');
        }
    };
    

    function onComposeClick () {
        navigate(`/email/${folder}/compose`);
    };

    return (
        <div className="email-side-nav">
            <button onClick={resetEmails} style={{ margin: '10px' }}>Reset Emails</button>
            <button onClick={onComposeClick} className="compose-btn">
                <i className="fas fa-pencil-alt" aria-hidden="true"></i> Compose Email
            </button>
            {Object.entries(folderData).map(([key, { count, icon }]) => {
                return (
                    <div
                        key={key}
                        onClick={() => handleFolderSelect(key)}
                        className={key === folder ? 'active' : ''}
                    >
                        <span>
                            <i className={`${icon} icon-style`} aria-hidden="true"></i>
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        </span>
                        <span style={{ marginLeft: '10px' }}>({count})</span>
                    </div>
                );
            })}
        </div>
    );
};
