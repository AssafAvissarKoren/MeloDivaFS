import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailList } from './EmailList';
import { EmailSideNav } from './EmailSideNav';
import { EmailHeaderFilter } from './EmailHeaderFilter';
import { emailService } from '../services/email.service';
import { Outlet } from 'react-router-dom';
import { EmailContext } from './EmailContext';
import { utilService } from '../services/util.service';


export const EmailIndex = () => {
    const [allEmails, setAllEmails] = useState(null); 
    const [filteredEmails, setFilteredEmails] = useState(null);
    const params = useParams();
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(params));
    const navigate = useNavigate();

    useEffect(() => {
        loadEmails();
        const filterURL = emailService.filterURL(filterBy)
        navigate(filterURL, { replace: true });
    }, [filterBy]);

    async function loadEmails() {
        const allEmails = await emailService.getEmails(); // CRQ any other way to keep allEmails for up to date sidenav?
        setAllEmails(allEmails);
        let fetchedEmails = await emailService.queryEmails(allEmails, filterBy);
        const sortedEmails = emailService.sortByFilter(fetchedEmails, filterBy.sort);
        setFilteredEmails(sortedEmails);
    }
    

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    const handleEmailSelect = async (emailId) => {
        if(params.folder == "drafts") {
            navigate(`/email/${params.folder}/edit/${emailId}`);
        } else {
            navigate(`/email/${params.folder}/${emailId}`);
        }
    };
    
    if (!filteredEmails) return <div>Loading...</div>;

    const unreadCount = filteredEmails.filter(email => !email.isRead).length;
    const totalEmails = filteredEmails.length;
    const unreadPercentage = totalEmails ? (unreadCount / totalEmails) * 100 : 0;

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
