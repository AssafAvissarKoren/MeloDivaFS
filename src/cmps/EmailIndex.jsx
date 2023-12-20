import { useEffect, useState } from 'react';
import { EmailList } from './EmailList';
import { EmailFilter } from './EmailFilter';
import { emailService } from '../services/email.service';
import { useNavigate } from 'react-router-dom';

export const EmailIndex = () => {
    const [emails, setEmails] = useState(null);
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
    const [sortCriterion, setSortCriterion] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadEmails()
    }, [filterBy, sortCriterion]);

    async function loadEmails() {
        let fetchedEmails = await emailService.queryEmails(filterBy);
        switch (sortCriterion) {
            case 'date':
                fetchedEmails.sort((a, b) => b.sentAt - a.sentAt);
                break;
            case 'title':
                fetchedEmails.sort((a, b) => a.subject.localeCompare(b.subject));
                break;
            default:
                // Default sorting logic if needed
                break;
        }
        setEmails(fetchedEmails);
    }

    const handleSortChange = (e) => {
        setSortCriterion(e.target.value);
    };

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    const handleEmailSelect = async (emailId) => {
        const updatedEmails = await emailService.markAsRead(emailId);
        setEmails(updatedEmails);
        navigate(`/email/${emailId}`);
    };
    
    const resetEmails = () => {
        emailService.initEmails()
        setFilterBy(emailService.getDefaultFilter());
        loadEmails()
    };

    function onComposeClick () {
        navigate('/email/compose');
    };


    if (!emails) return <div>Loading...</div>;

    const unreadCount = emails.filter(email => !email.isRead).length;
    const totalEmails = emails.length;
    const unreadPercentage = totalEmails ? (unreadCount / totalEmails) * 100 : 0;

    return (
        <div>
            <button onClick={resetEmails} style={{ margin: '10px' }}>Reset Emails</button>
            <select onChange={handleSortChange} value={sortCriterion}>
                <option value="">Sort By</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
            </select>
            <EmailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            <EmailList emails={emails} handleEmailSelect={handleEmailSelect} />
            <button onClick={onComposeClick} style={{ margin: '10px' }}>Compose Email</button>
            <div style={{ margin: '10px 0' }}>
                <div>Unread Emails: {unreadCount} / {totalEmails}</div>
                <div style={{ width: '100%', backgroundColor: '#ddd' }}>
                    <div style={{ height: '20px', width: `${unreadPercentage}%`, backgroundColor: 'green' }}></div>
                </div>
            </div>
        </div>
    );
};
