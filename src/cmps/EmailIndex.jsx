import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailSideNav } from './EmailSideNav';
import { EmailHeaderFilter } from './EmailHeaderFilter';
import { emailService } from '../services/email.service';
import { statsService } from '../services/stats.service';
import { Outlet } from 'react-router-dom';
import { EmailContext } from './EmailContext';
import { EmailCompose } from "./EmailCompose"

export const EmailIndex = () => {
    const params = useParams();
    const [indexEmailList, setIndexEmailList] = useState(null);
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(params));
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {   
        loadEmails();
        const filterURL = emailService.filterURL(filterBy);
        navigate(filterURL, { replace: true }); 
    }, [filterBy]);
    
    async function loadEmails() {
        const newEmailList = await emailService.queryEmails(filterBy)
        setIndexEmailList(newEmailList);
        await statsService.createStats();
    }

    const openComposeModal = () => {
        setIsComposeModalOpen(true);
    };
    
    const closeComposeModal = () => {
        setIsComposeModalOpen(false);
    };
    
    if (!indexEmailList) return <div>Loading...</div>;

    return (
        <EmailContext.Provider value={{ indexEmailList, setFilterBy, setIndexEmailList }}>
            <div className="email-index-container">
                <div className="email-name">
                    <h1>Green Mail</h1>
                </div>
                <div className="email-header-filter">
                    <EmailHeaderFilter setFilterBy={setFilterBy} />
                </div>
                <div className="email-side-nav">
                    <EmailSideNav 
                        setFilterBy={setFilterBy} 
                        onComposeClick={openComposeModal} 
                        loadEmails={loadEmails} 
                    />
                    {isComposeModalOpen && <EmailCompose closeModal={closeComposeModal} />}
                </div>
                <div className="email-list">
                    <Outlet />
                </div>
            </div>
        </EmailContext.Provider>
    );
};

