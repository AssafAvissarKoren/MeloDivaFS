import { useEffect, useState, useContext, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

import { EmailPreview } from './EmailPreview';
import { EmailContext } from './EmailContext';
import { EmailModal } from './EmailModal';
import { EmailActionButtons } from './EmailActionButtons';
import { EmailListNavButtons } from './EmailNavButtons'

import { emailService } from '../services/email.service';
import { eventBusService } from '../services/event-bus.service';
import { statsService } from '../services/stats.service';

export const EmailList = () => {
    const { indexEmailList, setFilterBy, setIndexEmailList } = useContext(EmailContext);
    const [emailList, setEmailList] = useState(indexEmailList);

    const [contextMenu, setContextMenu] = useState(null);
    const [sortCriterion, setSortCriterion] = useState('');
    const [allChecked, setAllChecked] = useState(false);
    const [emailsBeingMoved, setEmailsBeingMoved] = useState(null);
    const [checkboxStates, setCheckboxStates] = useState({
        All: false,
        None: false,
        Read: false,
        Unread: false,
        Starred: false,
        Unstarred: false
    });

    const [showDropdownModal, setShowDropdownModal] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setEmailList(indexEmailList);
    }, [sortCriterion, indexEmailList]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
          if (contextMenu) {
            if (!e.target.closest('.email-preview') && !e.target.closest('.context-menu')) {
              setContextMenu(null);
            }
          }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [contextMenu]);

    useEffect(() => {
        // Apply multiple conditions simultaneously to update the email list
        setEmailList(emailList.map(email => ({
            ...email,
            isChecked: (
                checkboxStates['All'] || 
                (checkboxStates['Read'] && email.isRead) || 
                (checkboxStates['Starred'] && email.isStarred) ||
                (checkboxStates['Unread'] && !email.isRead) || 
                (checkboxStates['Unstarred'] && !email.isStarred)
            )
        })));
    }, [checkboxStates]);

    useEffect(() => {
        if (emailList.some(email => !email.isChecked)) {
            setAllChecked(false);
        }
    }, [emailList]);

    const onToggleStar = async (email) => {
        const updatedEmail = { ...email, isStarred: !email.isStarred };
        await updateStateAndStorage(updatedEmail, true);
    };

    const onToggleRead = async (email, isContextMenu = false) => {
        let updatedEmail = email
        if (isContextMenu || (!isContextMenu && !email.isRead)) {
            updatedEmail = { ...email, isRead: !email.isRead }
        }
        await updateStateAndStorage(updatedEmail, false);
        setContextMenu(null);
    };

    const onToggleSelect = async (email) => {
        const updatedEmail = { ...email, isChecked: !email.isChecked }
        await updateStateAndStorage(updatedEmail, false);
    }

    async function updateStateAndStorage(updatedEmail, isReRender=false) {
        await emailService.saveEmail(updatedEmail, updatedEmail.folder);
        setEmailList(emailList.map(e => e.id === updatedEmail.id ? updatedEmail : e));
        if(isReRender) {
            setFilterBy(prevFilter => ({ ...prevFilter }))
        }
    }

    const handleContextMenu = (emailId, position) => {
        if (contextMenu && contextMenu.emailId === emailId) {
            setContextMenu(null);
        } else {
            setContextMenu({ emailId, position });
        }
    };

    const batchEmailsMove = async (emails, folder) => {
        const updatedEmailsIds = emails.map(email => email.id);
        const updatedEmails = emails.map(email => ({...email, folder: folder}));
        setEmailsBeingMoved(updatedEmailsIds);
        setTimeout(async () => {
            await emailService.updateBatchEmails(updatedEmails) //storage
            eventBusService.showSuccessMsg('Emails moved successfully');
            const updatedEmailList = emailList.filter(listEmail => !updatedEmailsIds.includes(listEmail.id))
            setIndexEmailList(updatedEmailList); // state
            setEmailsBeingMoved(null);
            await statsService.createStats();
            setFilterBy(prevFilter => ({ ...prevFilter }))
        }, 1000);
    }

    const batchEmailsRead = async (emails, markAsRead) => {
        const updatedEmailsIds = emails.map(email => email.id);
        const updatedEmails = emails.map(email => ({ ...email, isRead: markAsRead }));
        await emailService.updateBatchEmails(updatedEmails)
        const updatedEmailList = emailList.map(email => {
            if (updatedEmailsIds.includes(email.id)) {
                return { ...email, isRead: markAsRead };
            }
            return email;
        });
        setIndexEmailList(updatedEmailList);
        setFilterBy(prevFilter => ({ ...prevFilter }))
        await statsService.createStats();
    }


    const handleSortChange = (e) => {
        const newSortCriterion = e.target.value;
        setSortCriterion(newSortCriterion);
        setFilterBy(prevFilter => ({...prevFilter, sort: newSortCriterion}));
    };
    
    const toggleAllChecked = () => {
        setAllChecked(!allChecked);
        const updatedEmails = emailList.map(email => ({ ...email, isChecked: !allChecked }));
        setEmailList(updatedEmails);
    };

    const handleModalOptionClick = (option) => {
        // Update checkbox states
        setCheckboxStates(prevStates => {
            const newState = { ...prevStates, [option]: !prevStates[option] };
    
            if (option !== 'None' && newState[option]) {
                newState['None'] = false;
            }
            if (option !== 'All' && newState[option]) {
                newState['All'] = false;
            }
            
            // Handle opposites
            switch (option) {
                case 'All':
                    if (newState[option]) newState['None'] = false;
                    break;
                case 'None':
                    if (newState[option]) {
                        newState['All'] = false;
                        newState['Read'] = false;
                        newState['Unread'] = false;
                        newState['Starred'] = false;
                        newState['Unstarred'] = false;
                    }
                    break;
                case 'Read':
                    if (newState[option]) newState['Unread'] = false;
                    break;
                case 'Unread':
                    if (newState[option]) newState['Read'] = false;
                    break;
                case 'Starred':
                    if (newState[option]) newState['Unstarred'] = false;
                    break;
                case 'Unstarred':
                    if (newState[option]) newState['Starred'] = false;
                    break;
                default:
                    break;
            }
            return newState;
        });
    };
                    
    const dropdownContent = (
        <div className="dropdown-modal-content">
            {Object.entries(checkboxStates).map(([option, isChecked]) => (
                <div key={option} onClick={() => handleModalOptionClick(option)}>
                    <FontAwesomeIcon icon={isChecked ? faCheckSquare : farSquare} aria-hidden="true" /> {option}
                </div>
            ))}
        </div>
    );

    return (
        <div className="email-list">
            <div className="action-bar">
                <div className="start-buttons">
                    <div className="multi-selector">
                            <button onClick={toggleAllChecked}>
                                <FontAwesomeIcon icon={allChecked ? faCheckSquare : farSquare} aria-hidden="true" />
                            </button>
                            <button ref={dropdownRef}>
                                <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
                            </button>
                            <EmailModal
                                triggerRef={dropdownRef}
                                content={dropdownContent}
                                onClose={() => setShowDropdownModal(false)}
                            />
                    </div>
                </div>
                {emailList.some(email => email.isChecked) && 
                    <EmailActionButtons 
                        emails={emailList.filter(email => email.isChecked)} 
                        handleMove={batchEmailsMove}
                        handleRead={batchEmailsRead}
                    />
                }
                <EmailListNavButtons emails={emailList} />
            </div>
            <select onChange={handleSortChange} value={sortCriterion}>
                <option value="">Sort By</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
            </select>
            {emailList.map(email => (
                <EmailPreview
                    key={email.id}
                    email={email}
                    emailsBeingMoved={emailsBeingMoved}
                    onToggleStar={() => onToggleStar(email)}
                    onToggleRead={onToggleRead}
                    onToggleSelect={onToggleSelect}
                    onContextMenu={handleContextMenu}
                    contextMenuOpen={contextMenu?.emailId === email.id}
                    contextMenuPosition={contextMenu?.position}
                />
            ))}
        </div>
    );
};
