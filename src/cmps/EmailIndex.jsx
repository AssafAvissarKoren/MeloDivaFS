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

export const EmailIndex = () => {
    const [allEmails, setAllEmails] = useState(null); 
    const [indexEmailsList, setIndexEmailsList] = useState(null);
    const params = useParams();
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(params));
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
        const allEmails = await emailService.getEmails(); // CRQ any other way to keep allEmails for up to date sidenav?
        setAllEmails(allEmails);
        setIndexEmailsList(await emailService.queryEmails(allEmails, filterBy));
    }
    
    const handleEmailSelect = async (emailId) => {
        if(params.folder == "drafts") {
            navigate(`/email/${params.folder}/edit/${emailId}`);
        } else {
            navigate(`/email/${params.folder}/${emailId}`);
        }
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
                    <EmailSideNav emails={allEmails} setFilterBy={setFilterBy} />
                </div>
                <div className="email-list">
                    <Outlet />
                </div>
            </div>
        </EmailContext.Provider>
    );
};
