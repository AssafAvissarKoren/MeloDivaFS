import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailList } from './EmailList';
import { EmailSideNav } from './EmailSideNav';
import { EmailHeaderFilter } from './EmailHeaderFilter';
import { emailService } from '../services/email.service';
import { Outlet } from 'react-router-dom';
import { EmailContext } from './EmailContext';
import { utilService } from '../services/util.service';
import { eventBusService, showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { EmailCompose } from "./EmailCompose"

export const EmailIndex = () => {
    const params = useParams();
    const [allEmails, setAllEmails] = useState(null); 
    const [indexEmailsList, setIndexEmailsList] = useState(null);
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(params));
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeEmailDeleted = eventBusService.on('email-deleted', () => {loadEmails();});
        const unsubscribeEmailsReset = eventBusService.on('emails-reset', () => {loadEmails();});
    
        loadEmails();
        const filterURL = emailService.filterURL(filterBy);
        navigate(filterURL, { replace: true });
    
        return () => {
            unsubscribeEmailDeleted();
            unsubscribeEmailsReset();
        };    
    }, [filterBy]);
    
    async function loadEmails() {
        const newAllEmails = await emailService.getEmails();
        emailService.saveStats(analyzeEmails(newAllEmails))
        setAllEmails(newAllEmails);
        setIndexEmailsList(await emailService.queryEmails(newAllEmails, filterBy));
    }
    
    const handleEmailSelect = async (emailId) => {
        if(params.folder == "drafts") {
            navigate(`/email/${params.folder}/edit/${emailId}`);
        } else {
            navigate(`/email/${params.folder}/${emailId}`);
        }
    };
    
    const analyzeEmails = (emails) => {
        const folderStats = {};
    
        emails.forEach(email => {
            const folder = email.folder;
            const isRead = email.isRead;
    
            if (!folderStats[folder]) {
                folderStats[folder] = { total: 0, unread: 0 };
            }
    
            folderStats[folder].total += 1;
            if (!isRead) {
                folderStats[folder].unread += 1;
            }
        });
    
        return folderStats;
    };

    const openComposeModal = () => {
        setIsComposeModalOpen(true);
    };
    
    const closeComposeModal = () => {
        setIsComposeModalOpen(false);
    };
    

    if (!indexEmailsList) return <div>Loading...</div>;

    const unreadCount = indexEmailsList.filter(email => !email.isRead).length;
    const totalEmails = indexEmailsList.length;
    const unreadPercentage = totalEmails ? (unreadCount / totalEmails) * 100 : 0;

    return (
        <EmailContext.Provider value={{ indexEmailsList, setFilterBy, handleEmailSelect }}>
            <div className="email-index-container">
                <div className="email-name">
                    <h1>Green Mail</h1>
                </div>
                <div className="email-header-filter">
                    <EmailHeaderFilter setFilterBy={setFilterBy} />
                </div>
                <div className="email-side-nav">
                    <EmailSideNav emails={allEmails} setFilterBy={setFilterBy} onComposeClick={openComposeModal} />
                    {isComposeModalOpen && <EmailCompose closeModal={closeComposeModal} />}
                </div>
                <div className="email-list">
                    <Outlet />
                </div>
            </div>
        </EmailContext.Provider>
    );
};

