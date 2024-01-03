import { useEffect, useState, useContext, useRef } from 'react';
import { EmailPreview } from './EmailPreview';
import { emailService } from '../services/email.service';
import { useSearchParams } from 'react-router-dom';
import { EmailContext } from './EmailContext';
import { utilService } from '../services/util.service';
import { EmailModal } from './EmailModal';

export const EmailList = () => {
    const { indexEmailsList, setFilterBy, handleEmailSelect } = useContext(EmailContext);
    const [emailList, setEmailList] = useState(indexEmailsList);
    const [contextMenu, setContextMenu] = useState(null);
    const [sortCriterion, setSortCriterion] = useState('');

    const [allChecked, setAllChecked] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [showDropdownModal, setShowDropdownModal] = useState(false);
    const dropdownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [checkboxStates, setCheckboxStates] = useState({
        All: false,
        None: false,
        Read: false,
        Unread: false,
        Starred: false,
        Unstarred: false
    });


    useEffect(() => {
        setEmailList(indexEmailsList);
    }, [sortCriterion, indexEmailsList]);

    const handleSortChange = (e) => {
        const newSortCriterion = e.target.value;
        setSortCriterion(newSortCriterion);
        setFilterBy(prevFilter => ({...prevFilter, sort: newSortCriterion}));
    };
    
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

    const onToggleStar = async (email) => {
        const updatedEmail = { ...email, isStarred: !email.isStarred }
        await emailService.saveEmail(updatedEmail);
        setEmailList(emailList.map(e => e.id === updatedEmail.id ? updatedEmail : e));
        setFilterBy(prevFilter => ({ ...prevFilter }))
    };

    const onToggleRead = async (email, isContextMenu = false) => {
        let updatedEmail = email
        if (isContextMenu || (!isContextMenu && !email.isRead)) {
            updatedEmail = { ...email, isRead: !email.isRead }
        } 
        await emailService.saveEmail(updatedEmail, updatedEmail.folder);
        setEmailList(emailList.map(e => e.id === updatedEmail.id ? updatedEmail : e));
        setContextMenu(null);
    };

    const onToggleSelect = async (email) => {
        const updatedEmail = { ...email, isChecked: !email.isChecked }
        await emailService.saveEmail(updatedEmail, updatedEmail.folder);
        setEmailList(emailList.map(e => e.id === updatedEmail.id ? updatedEmail : e));
    }

    const handleContextMenu = (emailId, position) => {
        if (contextMenu && contextMenu.emailId === emailId) {
            setContextMenu(null);
        } else {
            setContextMenu({ emailId, position });
        }
    };

    const openModal = (elementRef, setShowModal) => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
            });
            setShowModal(true);
        }
    };

    const toggleAllChecked = () => {
        setAllChecked(!allChecked);
        // Update the checked status of all emails
        const updatedEmails = emailList.map(email => ({ ...email, isChecked: !allChecked }));
        setEmailList(updatedEmails);
        // Save the updated emails (if needed)
    };

    const handleModalOptionClick = (option) => {
        // Update checkbox states
        setCheckboxStates(prevStates => {
            const newState = { ...prevStates, [option]: !prevStates[option] };
    
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
            

    const dropdownContent = (
        <div className="dropdown-modal-content">
            {Object.entries(checkboxStates).map(([option, isChecked]) => (
                <div key={option} onClick={() => handleModalOptionClick(option)}>
                    <i className={`far ${isChecked ? 'fa-check-square' : 'fa-square'}`} aria-hidden="true"></i> {option}
                </div>
            ))}
        </div>
    );
    
    return (
        <div className="email-list">
            <div className="email-checkbox-dropdown">
                <button onClick={toggleAllChecked}>
                    <i className={`far ${allChecked ? 'fa-check-square' : 'fa-square'}`} aria-hidden="true"></i>
                </button>
                <button ref={dropdownRef} onClick={() => openModal(dropdownRef, setShowDropdownModal)}>
                <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    </button>
                    <EmailModal
                        isOpen={showDropdownModal}
                        content={dropdownContent}
                        onClose={() => setShowDropdownModal(false)}
                        position={dropdownPosition}
                    />
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
                    onSelectEmail={() => handleEmailSelect(email.id)}
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
