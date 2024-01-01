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
    backOneURLSegment,
}

const EMAIL_STORAGE_KEY = 'emailDB'
const USER_STORAGE_KEY = 'userDB'

async function queryEmails(allEmails, filterBy) {
    let emails = [...allEmails];

    // Apply filtering based on the provided filter criteria
    if (filterBy) {
        if (filterBy.folder) {
            if (filterBy.folder === 'starred') {
                emails = emails.filter(email => email.isStarred);
            } else {
                emails = emails.filter(email => email.folder === filterBy.folder);
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

    // Sort the emails based on the filter criteria
    switch (filterBy.sort) {
        case 'date':
            emails.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
            break;
        case 'title':
            emails.sort((a, b) => a.subject.localeCompare(b.subject));
            break;
        // Add more sort cases if necessary
    }

    // Link emails with their next and previous emails
    if (emails.length > 0) {
        emails[0].prevEmailId = null;
        emails[0].listIndex = 1; // Start index at 1

        for (let i = 1; i < emails.length; i++) {
            emails[i].prevEmailId = emails[i - 1].id;
            emails[i - 1].nextEmailId = emails[i].id;
            emails[i].listIndex = i + 1;
        }

        emails[emails.length - 1].nextEmailId = null; // Last email's nextEmailId is null
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

async function createEmail(subject = "", body = "", to = "", folder="inbox", from=loggedinUser.email, sentAt=new Date().getTime()) {
    const loggedinUser = await storageService.query(USER_STORAGE_KEY);
    return { 
        id: null,
        subject: subject, 
        body: body, 
        isRead: null, 
        isStarred: false, 
        sentAt: sentAt, 
        removedAt: null, 
        from: from, 
        to: to,
        folder: folder,
        prevEmailId: null,
        nextEmailId: null,
        listIndex: null,
        isChecked: false,
    }
}

async function initEmails() {
    _createUser()
    const loggedinUser = await storageService.query(USER_STORAGE_KEY);
    let defaultContent = [
        { subject: 'Miss you!', from: 'momo@momo.com' },
        { subject: 'Meeting Update', from: 'jane@company.com' },
        { subject: 'Your Order Confirmation', from: 'orders@store.com' },
        { subject: 'Upcoming Event Reminder', from: 'events@community.org' },
        { subject: 'Happy Birthday!', from: 'friend@email.com' },
        { subject: 'Project Collaboration', from: 'colleague@work.com' },
        { subject: 'Weekend Plans', from: 'friend@personal.com' },
        { subject: 'Subscription Renewal', from: 'service@subscription.com' },
        { subject: 'Flight Itinerary', from: 'travel@airline.com' },
        { subject: 'Security Alert', from: 'security@bank.com' }
    ];
    let savedEmails = []; // Array to store saved emails

    for (const email of defaultContent) {
        const emailToCreate = await createEmail(
            email.subject, 
            utilService.makeLorem(1), 
            loggedinUser.email, 
            "inbox",
            email.from,
            new Date().getTime() - Math.floor(Math.random() * 1000000000),
        );
        const savedEmailsWithId = {...emailToCreate, id: utilService.makeId()}
        savedEmails.push(savedEmailsWithId); // Add the saved email to the array
    }
    utilService.saveToStorage(EMAIL_STORAGE_KEY, savedEmails)
}

function _createUser() {
    const loggedinUser = { email: 'user@appsus.com', fullname: 'Mahatma Appsus' }
    utilService.saveToStorage(USER_STORAGE_KEY, loggedinUser)
}

function backOneURLSegment(navigate) {
    const pathArray = window.location.hash.split('/');
    const newPath = '/' + pathArray.slice(1, pathArray.length - 1).join('/');
    navigate(newPath);
}
