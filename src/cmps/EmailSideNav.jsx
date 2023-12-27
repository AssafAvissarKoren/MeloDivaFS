import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';

export const EmailSideNav = ({ emails, setFilterBy }) => {
    const navigate = useNavigate();
    const { folder } = useParams();

    useEffect(() => {
        setFilterBy(prev => ({ ...prev, folder }));
    }, [folder, setFilterBy]);

    const folderCounts = {
        inbox: emails.filter(email => email.folder === 'inbox').length,
        starred: emails.filter(email => email.isStarred).length,
        sent: emails.filter(email => email.folder === 'sent').length,
        drafts: emails.filter(email => email.folder === 'drafts').length,
        trash: emails.filter(email => email.folder === 'trash').length,
    };

    const handleFolderSelect = (selectedFolder) => {
        setFilterBy(prev => ({ ...prev, folder: selectedFolder }));
    };

    const resetEmails = () => {
        emailService.initEmails()
        setFilterBy(emailService.getDefaultFilter());
    };

    function onComposeClick () {
        navigate(`/email/${folder}/compose`);
    };

    return (
        <div className="email-side-nav">
            <button onClick={resetEmails} style={{ margin: '10px' }}>Reset Emails</button>
            <button onClick={onComposeClick} style={{ margin: '10px' }}>Compose Email</button>
            {Object.entries(folderCounts).map(([key, count]) => (
                <div
                    key={key}
                    onClick={() => handleFolderSelect(key)}
                    className={key === folder ? 'active' : ''}
                >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <span>({count})</span>
                </div>
            ))}
        </div>
    );
};
