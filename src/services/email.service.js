import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
    initEmails,
    queryEmails,
    saveEmail,
    remove,
    getById,
    createEmail,
    markAsRead,
    markAsUnread,
    getDefaultFilter,
    updateStarFolder,
    findEmailFolders
}

const EMAIL_STORAGE_KEY = 'emailDB'
const USER_STORAGE_KEY = 'userDB'
const FOLDER_STORAGE_KEY = 'folderDB'

async function queryEmails(filterBy) {
    let emails = await storageService.query(EMAIL_STORAGE_KEY);
    const folderStructure = await storageService.query(FOLDER_STORAGE_KEY);

    if (filterBy) {
        // If filterBy.status is specified and not 'all', filter by folder
        if (filterBy.status && filterBy.status !== 'all') {
            const folder = folderStructure.find(f => f.folder === filterBy.status);
            if (folder) {
                emails = emails.filter(email => folder.emails.includes(email.id));
            } else {
                // If specified folder doesn't exist, return empty array
                return [];
            }
        }

        // Apply other filters if any
        if (filterBy.text || filterBy.isRead !== null) {
            emails = emails.filter(email => {
                const textMatch = !filterBy.text || email.subject.includes(filterBy.text) || email.body.includes(filterBy.text) || email.from.includes(filterBy.text);
                const isReadMatch = filterBy.isRead === null || email.isRead === filterBy.isRead;
                
                return textMatch && isReadMatch;
            });
        }
    }

    return emails;
}

function getById(id) {
    return storageService.get(EMAIL_STORAGE_KEY, id)
}

async function findEmailFolders(emailId) {
    const folderStructure = await storageService.query(FOLDER_STORAGE_KEY);
    const foldersWithEmail = folderStructure
        .filter(folder => folder.emails.includes(emailId))
        .map(folder => folder.folder);
    return foldersWithEmail;
}


function remove(id) {
    return storageService.remove(EMAIL_STORAGE_KEY, id)
}

async function saveEmail(emailToSave, folders = ["inbox"]) {
    let savedEmail;

    if (emailToSave.id) {
        savedEmail = await storageService.put(EMAIL_STORAGE_KEY, emailToSave);
    } else {
        savedEmail = await storageService.post(EMAIL_STORAGE_KEY, emailToSave);
    }

    _saveFolder(savedEmail.id, folders);
    return savedEmail;
}

async function _saveFolder(emailToSaveId, folderNames) {
    let folders = await storageService.query(FOLDER_STORAGE_KEY);
    let emails = await storageService.query(EMAIL_STORAGE_KEY);

    // Get the email by id
    const email = emails.find(e => e.id === emailToSaveId);

    // Update the folder structure
    folders = folders.map(folder => {
        // If the email should be in this folder, add it (if not already present)
        if (folderNames.includes(folder.folder)) {
            if (!folder.emails.includes(emailToSaveId)) {
                return { ...folder, emails: [...folder.emails, emailToSaveId] };
            }
            return folder;
        }

        // If the email shouldn't be in this folder, remove it
        return {...folder, emails: folder.emails.filter(emailId => emailId !== emailToSaveId)};
    });

    // Special handling for 'star' folder based on email's isStarred status
    if (email && email.isStarred && !folderNames.includes('star')) {
        const starFolder = folders.find(folder => folder.folder === 'star');
        if (!starFolder.emails.includes(emailToSaveId)) {
            starFolder.emails.push(emailToSaveId);
        }
    }

    // Directly save the updated folder structure
    await storageService.saveAll(FOLDER_STORAGE_KEY, folders);
}

async function markAsRead(id) {
    return _markAs(id, true)
}

async function markAsUnread(id) {
    return _markAs(id, false)
}

async function _markAs(id, isRead) {
    const emails = await storageService.query(EMAIL_STORAGE_KEY); // Assuming this queries all emails
    const updatedEmails = emails.map(email => {
        if (email.id === id) {
            return { ...email, isRead: isRead };
        }
        return email;
    });

    // Assuming you have a function to save all emails back to storage
    await storageService.saveAll(EMAIL_STORAGE_KEY, updatedEmails);
    return updatedEmails; // Return the updated list of emails
}


function getDefaultFilter() {
    return {
        status: 'all',
        text: '',
        isRead: null,
    }
}

async function createEmail(subject = '', body = '', to = '') {
    const loggedinUser = await storageService.query(USER_STORAGE_KEY);
    const newEmail = { 
        id: null,
        subject: subject, 
        body: body, 
        isRead: null, 
        isStarred: false, 
        sentAt: new Date().getTime(), 
        removedAt: null, 
        from: loggedinUser.email, 
        to: to 
    }
    return newEmail
}

async function initEmails() {
    _createUser()
    const loggedinUser = await storageService.query(USER_STORAGE_KEY);
    let defaultEmails = [
        { id: 'e101', subject: 'Miss you!', body: 'Would love to catch up sometimes,', from: 'momo@momo.com' },
        { id: 'e102', subject: 'Meeting Update', body: 'The meeting has been rescheduled to next week.', from: 'jane@company.com' },
        { id: 'e103', subject: 'Your Order Confirmation', body: 'Thank you for your purchase! Your order is on the way.', from: 'orders@store.com' },
        { id: 'e104', subject: 'Upcoming Event Reminder', body: 'Don\'t forget about the event this Saturday!', from: 'events@community.org' },
        { id: 'e105', subject: 'Happy Birthday!', body: 'Wishing you all the best on your special day!', from: 'friend@email.com' },
        { id: 'e106', subject: 'Project Collaboration', body: 'Looking forward to working with you on our upcoming project.', from: 'colleague@work.com' },
        { id: 'e107', subject: 'Weekend Plans', body: 'Are we still on for hiking this weekend?', from: 'friend@personal.com' },
        { id: 'e108', subject: 'Subscription Renewal', body: 'Your subscription will be renewed automatically in 3 days.', from: 'service@subscription.com' },
        { id: 'e109', subject: 'Flight Itinerary', body: 'Your flight details and itinerary are enclosed.', from: 'travel@airline.com' },
        { id: 'e110', subject: 'Security Alert', body: 'Unusual activity detected in your account.', from: 'security@bank.com' }
    ];

    defaultEmails = defaultEmails.map(email => ({
        ...email,
        isRead: null,
        isStarred: null,
        sentAt: new Date().getTime() - Math.floor(Math.random() * 1000000000),
        removedAt: null,
        to: loggedinUser.email
    }));
    utilService.saveToStorage(EMAIL_STORAGE_KEY, defaultEmails);

    let folderStructure = [
        { folder: "inbox", emails: defaultEmails.map(email => email.id) },
        { folder: "sent", emails: [] },
        { folder: "trash", emails: [] },
        { folder: "star", emails: [] }
    ];
    utilService.saveToStorage(FOLDER_STORAGE_KEY, folderStructure);
}


function _createUser() {
    const loggedinUser = { email: 'user@appsus.com', fullname: 'Mahatma Appsus' }
    utilService.saveToStorage(USER_STORAGE_KEY, loggedinUser)
}

async function updateStarFolder(updatedEmails, emailId) {
    // Get the current folder structure
    const folderStructure = await storageService.query(FOLDER_STORAGE_KEY);
    const starFolder = folderStructure.find(folder => folder.folder === 'star');

    // Update the email in storage
    const emailToUpdate = updatedEmails.find(email => email.id === emailId);
    if (emailToUpdate) {
        await saveEmail(emailToUpdate);

        // Update the star folder
        if (emailToUpdate.isStarred) {
            if (!starFolder.emails.includes(emailId)) {
                starFolder.emails.push(emailId);
            }
        } else {
            starFolder.emails = starFolder.emails.filter(id => id !== emailId);
        }

        // Save the updated folder structure
        await storageService.saveAll(FOLDER_STORAGE_KEY, folderStructure);    
    }
}
