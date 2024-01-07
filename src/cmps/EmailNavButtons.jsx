import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export const EmailNavButtons = ({ email, emailListLength }) => {
    if (!email) return null;
    return (
        <NavButtons
            emailListIndex={email.listIndex}
            emailListLength={emailListLength}
            prevId={email.prevEmailId ? `/email/${email.folder}/${email.prevEmailId}` : ''}
            nextId={email.nextEmailId ? `/email/${email.folder}/${email.nextEmailId}` : ''}
        />
    );
};

export const EmailListNavButtons = ({ emails }) => {
    if (!emails || emails.length === 0) return null;
    return (
        <NavButtons
            emailListIndex={emails.length}
            emailListLength={emails.length}
            prevId={`/email/inbox`}
            nextId={`/email/inbox`}
        />
    );
};

const NavButtons = ({ emailListIndex, emailListLength, prevId, nextId }) => {
    const navigate = useNavigate();

    return (
        <div className="email-nav-buttons">
            <span>{emailListIndex} of {emailListLength}</span>
            <button className="prevBtn" 
                disabled={!prevId}
                onClick={() => navigate(prevId)}>
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
            </button>
            <button className="nextBtn" 
                disabled={!nextId}
                onClick={() => navigate(nextId)}>
                Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};
