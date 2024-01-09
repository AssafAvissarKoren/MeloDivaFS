import React from 'react';
import { useState, useRef } from 'react';
import { emailService } from '../services/email.service';
import { eventBusService } from "../services/event-bus.service";
import { EmailModal } from '../cmps/EmailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faExclamationCircle, faTrashAlt, faEnvelopeOpenText, faEnvelope, faClock, faTasks, faFolder, faTag, faEllipsisV, faStar, 
    faCalendarPlus, faFilter, faVolumeMute, faHighlighter } from '@fortawesome/free-solid-svg-icons';
    
export const EmailActionButtons = ({ emails, handleMove , handleRead }) => {
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const optionsDDRef = useRef(null);
    const moveDDRef = useRef(null);

    const handleEmailsMove = async (folder) => {
        try {
            if(emails.length == 1) {
                await handleMove(emails[0], folder);
            } else {
                await handleMove(emails, folder);
            }
        } catch (error) {
            console.error('Error moving emails:', error);
            eventBusService.showErrorMsg('Could not move emails');
        }
    };


    const handleEmailsRead = async (markAsRead) => {
        try {
            if(emails.length == 1) {
                await handleRead(emails[0], markAsRead);
            } else {
                await handleRead(emails, markAsRead);
            }
        } catch (error) {
            console.error('Error changing emails read status:', error);
            eventBusService.showErrorMsg('Could not change emails read status');
        }
    };

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
                        <span className="option-text" onClick={async () => await handleEmailsMove(folder.toLocaleLowerCase())}>{folder}</span>
                    </div>
            ))}
        </div>
    );

    return (
        <div className="email-action-buttons">
            <button className="archive" name="archive" onClick={() => handleFeatureTBA("Archiving messages")}>
                <FontAwesomeIcon icon={faArchive} />
            </button>
            <button className="report-spam" name="report spam" onClick={() => handleFeatureTBA("Report spam")}>
                <FontAwesomeIcon icon={faExclamationCircle} />
            </button>
            <button className="delete" name="delete" onClick={async () => await handleEmailsMove("trash")}>
                <FontAwesomeIcon icon={faTrashAlt} />
            </button>
            <div className="divider"></div>
            <button className="mark-as-unread" name="mark as unread" onClick={() => handleEmailsRead(false)}>
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
            </button>
            <button className="mark-as-read" name="mark as read" onClick={() => handleEmailsRead(true)}>
                <FontAwesomeIcon icon={faEnvelope} />
            </button>
            <button className="snooze" name="snooze" onClick={() => handleFeatureTBA("Snoozing messages")}>
                <FontAwesomeIcon icon={faClock} />
            </button>
            <button className="add-to-tasks" name="add to tasks" onClick={() => handleFeatureTBA("Adding to tasks")}>
                <FontAwesomeIcon icon={faTasks} />
            </button>
            
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
