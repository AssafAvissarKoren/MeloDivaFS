import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailList } from './EmailList';
import { EmailSideNav } from './EmailSideNav';
import { EmailHeaderFilter } from './EmailHeaderFilter';
import { emailService } from '../services/email.service';
import { Outlet } from 'react-router-dom';
import { EmailContext } from './EmailContext';


export const EmailIndex = () => {
    const [allEmails, setAllEmails] = useState(null); // Full list of emails
    const [filteredEmails, setFilteredEmails] = useState(null); // Filtered list of emails
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
    const navigate = useNavigate();
    const { folder } = useParams();

    useEffect(() => {
        loadEmails();
        const filterURL = emailService.filterURL(filterBy)
        navigate(filterURL, { replace: true });
    }, [filterBy]);

    async function loadEmails() {
        const allEmails = await emailService.getEmails();
        setAllEmails(allEmails);
        const fetchedEmails = await emailService.queryEmails(allEmails, filterBy);
        setFilteredEmails(fetchedEmails);
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    const handleEmailSelect = async (emailId) => {
        const updatedEmails = await emailService.markAsRead(emailId);
        setFilteredEmails(updatedEmails);
        navigate(`/email/${folder}/${emailId}`);
    };
    
    if (!filteredEmails) return <div>Loading...</div>;

    const unreadCount = filteredEmails.filter(email => !email.isRead).length;
    const totalEmails = filteredEmails.length;
    const unreadPercentage = totalEmails ? (unreadCount / totalEmails) * 100 : 0;

    // const filteredEmails = folder ? emails.filter(email => email.folder === folder) : emails;

    return (
        <EmailContext.Provider value={{ filteredEmails, setFilterBy, handleEmailSelect }}>
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
