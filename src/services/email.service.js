import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
    initEmails,
    queryEmails,
    saveEmail,
    remove,
    getById,
    createEmail,
    getDefaultFilter,
    getEmails,
    filterURL,
    sortByFilter,
}

const EMAIL_STORAGE_KEY = 'emailDB'
const USER_STORAGE_KEY = 'userDB'

async function queryEmails(allEmails, filterBy) {
    let emails = [...allEmails];

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
    if (filterBy.sort) {
        queryParams.append('sort', filterBy.sort);
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`;
    }
    return url;
}

function getEmails() {
    return storageService.query(EMAIL_STORAGE_KEY);
}

function getById(id) {
    return storageService.get(EMAIL_STORAGE_KEY, id);
}

function remove(id) {
    return storageService.remove(EMAIL_STORAGE_KEY, id);
}

async function saveEmail(emailToSave, folderName = "inbox") {
    const savedEmail = {...emailToSave, folder: folderName};

    if (savedEmail.id) {
        return await storageService.put(EMAIL_STORAGE_KEY, savedEmail);
    } else {
        return await storageService.post(EMAIL_STORAGE_KEY, savedEmail);
    }
}

function getDefaultFilter(params) {
    return {
        folder: params.folder || "inbox",
        text: params.text || "",
        isRead: params.isRead !== undefined ? params.isRead : null,
        sort: params.sort || "",
    };
}

function sortByFilter(fetchedEmails, sortParam) {
    switch (sortParam) {
    case 'date':
        fetchedEmails.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
        break;
    case 'title':
        fetchedEmails.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
    default:
        break;
    }
    return fetchedEmails
}


async function createEmail(subject = "", body = "", to = "", folder="inbox") {
    const loggedinUser = await storageService.query(USER_STORAGE_KEY);
    return { 
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
}

async function initEmails() {
    _createUser()
    const loggedinUser = await storageService.query(USER_STORAGE_KEY);
    let defaultEmails = [
        { id: 'e101', subject: 'Miss you!', from: 'momo@momo.com' },
        { id: 'e102', subject: 'Meeting Update', from: 'jane@company.com' },
        { id: 'e103', subject: 'Your Order Confirmation', from: 'orders@store.com' },
        { id: 'e104', subject: 'Upcoming Event Reminder', from: 'events@community.org' },
        { id: 'e105', subject: 'Happy Birthday!', from: 'friend@email.com' },
        { id: 'e106', subject: 'Project Collaboration', from: 'colleague@work.com' },
        { id: 'e107', subject: 'Weekend Plans', from: 'friend@personal.com' },
        { id: 'e108', subject: 'Subscription Renewal', from: 'service@subscription.com' },
        { id: 'e109', subject: 'Flight Itinerary', from: 'travel@airline.com' },
        { id: 'e110', subject: 'Security Alert', from: 'security@bank.com' }
    ];

    defaultEmails = defaultEmails.map(email => ({
        ...email,
        body: utilService.makeLorem(1),
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