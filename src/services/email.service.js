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
    getEmails,
    filterURL,
}

const EMAIL_STORAGE_KEY = 'emailDB'
const USER_STORAGE_KEY = 'userDB'

async function queryEmails(emailsParam, filterBy) {
    let emails = [...emailsParam];

    if (filterBy) {
        if (filterBy.folder) {
            if (filterBy.folder == 'starred') {
                emails = emails.filter(email => email.isStarred);
            } else {
                emails = emails.filter(email => email.folder == filterBy.folder);
            }
        }

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

function filterURL(filterBy) {
    let url = `/email/${filterBy.folder || 'inbox'}`;
    const queryParams = new URLSearchParams();

    if (filterBy.text) {
        queryParams.append('text', filterBy.text);
    }
    if (filterBy.isRead !== null) {
        queryParams.append('isRead', filterBy.isRead);
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`;
    }
    return url
}

function getEmails() {
    return storageService.query(EMAIL_STORAGE_KEY);
}

function getById(id) {
    return storageService.get(EMAIL_STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(EMAIL_STORAGE_KEY, id)
}

async function saveEmail(emailToSave, folderName = "inbox") {
    const savedEmail = {...emailToSave, folder: folderName};

    if (savedEmail.id) {
        await storageService.put(EMAIL_STORAGE_KEY, savedEmail);
    } else {
        await storageService.post(EMAIL_STORAGE_KEY, savedEmail);
    }
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
        folder: 'inbox',
        text: '',
        isRead: null,
    }
}

async function createEmail(subject = '', body = '', to = '', folder='inbox') {
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
        to: to,
        folder: folder,
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
        folder: "inbox",
        isRead: null,
        isStarred: null,
        sentAt: new Date().getTime() - Math.floor(Math.random() * 1000000000),
        removedAt: null,
        to: loggedinUser.email
    }));
    utilService.saveToStorage(EMAIL_STORAGE_KEY, defaultEmails);
}

function _createUser() {
    const loggedinUser = { email: 'user@appsus.com', fullname: 'Mahatma Appsus' }
    utilService.saveToStorage(USER_STORAGE_KEY, loggedinUser)
}