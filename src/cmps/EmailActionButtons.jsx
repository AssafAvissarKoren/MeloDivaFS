import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailService } from '../services/email.service';
import { statsService } from "../services/stats.service";
import { eventBusService } from "../services/event-bus.service";
import { EmailModal } from '../cmps/EmailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faExclamationCircle, faTrashAlt, faEnvelopeOpenText, faEnvelope, faClock, faTasks, faFolder, faTag, faEllipsisV, faStar, 
    faCalendarPlus, faFilter, faVolumeMute, faHighlighter } from '@fortawesome/free-solid-svg-icons';


export const EmailActionButtonsList = ({ emails, setIndexEmailList, batchEmailsMove }) => {
    return (
        <EmailActionButtons
            emails={emails}
            setIndexEmailList={setIndexEmailList}
            batchEmailsMove={batchEmailsMove}
        />
    );
}

export const EmailActionButtonsDetails = ({ email, setIndexEmailList, setFilterBy }) => {
    return (
        <EmailActionButtons
            emails={[email]}
            setIndexEmailList={setIndexEmailList}
            setFilterBy={setFilterBy}
        />
    );
}
    
const EmailActionButtons = ({ emails, setIndexEmailList, setFilterBy=null, batchEmailsMove=null }) => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const optionsDDRef = useRef(null);
    const moveDDRef = useRef(null);

    const handleBatchMove = async (folder) => {

        try {
            if(batchEmailsMove) {
                await batchEmailsMove(emails, folder);
            }
            if(setFilterBy) {
                await emailService.saveEmail(emails[0], folder);
                setFilterBy(prevFilter => ({ ...prevFilter }));
            }
            navigate(`/email/${emails[0].folder}`);    
        } catch (error) {
            console.error('Error deleting emails:', error);
            eventBusService.showErrorMsg('Could not delete emails');
        }
    };


    async function handleReadAll( markAsRead ) {
        const updatedEmails = await Promise.all(emails.map(async email => {
            const updatedEmail = { ...email, isRead: markAsRead };
            await emailService.saveEmail(updatedEmail, updatedEmail.folder);
            return updatedEmail;
        }));
    
        setIndexEmailList(prevList => prevList.map(email => {
            const updatedEmail = updatedEmails.find(uEmail => uEmail.id === email.id);
            return updatedEmail || email;
        }));
    }

    const handleFeatureTBA = (featureName) => {
        eventBusService.showTBAMsg(`${featureName}\nwill be implemented shortly!`);
    };
        
    const moreOptionsContent = (
        <div className="modal-content">
            <button className="modal-option" onClick={() => handleFeatureTBA("Mark as not important")}>
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
                <span className="option-text">Mark as not important</span>
            </button>
            <button className="modal-option" onClick={() => handleFeatureTBA("Add star")}>
                <FontAwesomeIcon icon={faStar} />
                <span className="option-text">Add star</span>
            </button>
            <button className="modal-option" onClick={() => handleFeatureTBA("Create event")}>
                <FontAwesomeIcon icon={faCalendarPlus} />
                <span className="option-text">Create event</span>
            </button>
            <button className="modal-option" onClick={() => handleFeatureTBA("Filter messages like these")}>
                <FontAwesomeIcon icon={faFilter} />
                <span className="option-text">Filter messages like these</span>
            </button>
            <button className="modal-option" onClick={() => handleFeatureTBA("Mute")}>
                <FontAwesomeIcon icon={faVolumeMute} />
                <span className="option-text">Mute</span>
            </button>
            <button className="modal-option" onClick={() => handleFeatureTBA("Turn off highlighting")}>
                <FontAwesomeIcon icon={faHighlighter} />
                <span className="option-text">Turn off highlighting</span>
            </button>
        </div>
    );

    const moveContent = (
        <div className="modal-content">
            {emailService.getFolders()
                .filter(folder => folder.toLowerCase() !== emails[0].folder)
                .map((folder, index) => (
                    <div key={index} className="modal-option">
                        <span className="option-text" onClick={async () => await handleBatchMove(folder.toLocaleLowerCase())}>{folder}</span>
                    </div>
            ))}
        </div>
    );

    return (
        <div className="email-action-buttons">
            <button className="archive" name="archive" onClick={handleFeatureTBA}><FontAwesomeIcon icon={faArchive} /></button>
            <button className="report-spam" name="report spam"><FontAwesomeIcon icon={faExclamationCircle} /></button>
            <button className="delete" name="delete" onClick={async () => await handleBatchMove("trash")}><FontAwesomeIcon icon={faTrashAlt} /></button>
            <div className="divider"></div>
            <button className="mark-as-unread" name="mark as unread" onClick={() => handleReadAll(false)}><FontAwesomeIcon icon={faEnvelopeOpenText} /></button>
            <button className="mark-as-read" name="mark as read" onClick={() => handleReadAll(true)}><FontAwesomeIcon icon={faEnvelope} /></button>
            <button className="snooze" name="snooze"><FontAwesomeIcon icon={faClock} /></button>
            <button className="add-to-tasks" name="add to tasks"><FontAwesomeIcon icon={faTasks} /></button>
            
            <button className="move-to" name="move to" ref={moveDDRef}><FontAwesomeIcon icon={faFolder} /></button>
            <EmailModal
                triggerRef={moveDDRef}
                content={moveContent}
                onClose={() => setShowMoveModal(false)}
            />
            <button className="labels" name="labels"><FontAwesomeIcon icon={faTag} /></button>
            
            <button className="more" name="more" ref={optionsDDRef}><FontAwesomeIcon icon={faEllipsisV} aria-hidden="true" /></button>
            <EmailModal
                triggerRef={optionsDDRef}
                content={moreOptionsContent}
                onClose={() => setShowOptionsModal(false)}
            />
        </div>
    );
};
