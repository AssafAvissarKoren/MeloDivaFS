import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { statsService } from './stats.service.js'
import { eventBusService } from './event-bus.service.js'

export const emailService = {
    initEmails,
    queryEmails,
    saveEmail,
    removeEmail,
    getById,
    createEmail,
    getDefaultFilter,
    getEmails,
    filterURL,
    backOneURLSegment,
    getFolders,
    onDeleteEmail,
    updateBatchEmails,
}

const EMAIL_STORAGE_KEY = 'emailDB'

function getFolders() {
    return ["Inbox", "Spam", "Trash"];
}

async function queryEmails(filterBy) {
    let emails = await emailService.getEmails();

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

function removeEmail(id) {
    return storageService.remove(EMAIL_STORAGE_KEY, id);
}

async function saveEmail(emailToSave, folderName = "inbox") {
    const savedEmail = {...emailToSave, folder: folderName, isChecked: false};
    let newEmail
    if (savedEmail.id) {
        newEmail = await storageService.put(EMAIL_STORAGE_KEY, savedEmail);
    } else {
        newEmail = await storageService.post(EMAIL_STORAGE_KEY, savedEmail);
    }
    await statsService.createStats();
    return newEmail
}

function getDefaultFilter(params) {
    return {
        folder: params.folder || "inbox",
        text: params.text || "",
        isRead: params.isRead !== undefined ? params.isRead : null,
        sort: params.sort || "",
    };
}

async function createEmail(
    subject = "", 
    body = "", 
    to = "", 
    folder = "inbox", 
    from = null, 
    sentAt = new Date().getTime(), 
    isRead = null, 
    isStarred = false,
    location = null,
) {
    let newLocation;
    if(!location) {
        try {
            newLocation = await getLocation();
        } catch (err) {
            console.error('Error fetching location:', err);
            newLocation = { latitude: null, longitude: null };
        }
    } else {
        newLocation = location;
    }
    
    let newFrom;
    if(!from) {
        try {
            newFrom = await userService.getUser().email;
        } catch (err) {
            console.error('Error fetching location:', err);
            newFrom = null;
        }
    } else {
        newFrom = from;
    }

    return { 
        id: null,
        subject: subject, 
        body: body, 
        isRead: isRead, 
        isStarred: isStarred,
        sentAt: sentAt, 
        removedAt: null, 
        from: newFrom, 
        to: to,
        folder: folder,
        prevEmailId: null,
        nextEmailId: null,
        listIndex: null,
        isChecked: false,
        location: newLocation,
    }
}

const getLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by this browser.');
        }
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            }, 
            err => {
                reject(err);
            }
        );
    });
};

function backOneURLSegment(navigate) {
    const pathArray = window.location.hash.split('/');
    const newPath = '/' + pathArray.slice(1, pathArray.length - 1).join('/');
    navigate(newPath);
}

async function initEmails() {
    userService.createUser()
    const loggedinUser = userService.getUser()
    let savedEmails = []; // Array to store saved emails
    const location = await getLocation();
    for (const email of defaultContent) {
        const emailToCreate = await createEmail(
            email.subject, 
            utilService.makeLorem(1), 
            loggedinUser.email, 
            email.folder,
            email.from,
            new Date().getTime() - Math.floor(Math.random() * 1000000000),
            email.isRead,
            email.isStarred,
            location,
        );
        const savedEmailsWithId = {...emailToCreate, id: utilService.makeId()}
        savedEmails.push(savedEmailsWithId); // Add the saved email to the array
    };
    utilService.saveToStorage(EMAIL_STORAGE_KEY, savedEmails);
    statsService.createStats();
}

async function onDeleteEmail(email) {
    if(email.folder === "trash") {
        await removeEmail(email.id);
        eventBusService.showSuccessMsg('Email deleted successfully');
    } else {
        await saveEmail(email, "trash");
        eventBusService.showSuccessMsg('Email moved to Trash folder successfully');
    }
    statsService.createStats();
};

async function updateBatchEmails(updatedEmails) {
    const allEmails = await getEmails();
    const updatedAllEmails = await _updateEmailLists(updatedEmails, allEmails);
    utilService.saveToStorage(EMAIL_STORAGE_KEY, updatedAllEmails);
}


async function _updateEmailLists (updatedEmails, currentEmails) {
    const updatedHashMap = {};
    const currentHashMap = {};
    updatedEmails.forEach((updatedEmail, index) => {
        updatedHashMap[updatedEmail.id] = index;
    });
    currentEmails.forEach((currentEmail, index) => {
        currentHashMap[currentEmail.id] = index;
    });
    const mergedEmailList = currentEmails.map(currentEmail => {
        if (updatedHashMap.hasOwnProperty(currentEmail.id)) {
            return updatedEmails[updatedHashMap[currentEmail.id]];
        }
        return currentEmail;
    });
    return mergedEmailList;
}

const defaultContent = [
    { subject: 'Miss you!', from: 'momo@momo.com', isRead: true, folder: 'inbox', isStarred: false },
    { subject: 'Meeting Update', from: 'jane@company.com', isRead: true, folder: 'sent', isStarred: true },
    { subject: 'Your Order Confirmation', from: 'orders@store.com', isRead: true, folder: 'drafts', isStarred: false },
    { subject: 'Upcoming Event Reminder', from: 'events@community.org', isRead: false, folder: 'trash', isStarred: true },
    { subject: 'Happy Birthday!', from: 'friend@email.com', isRead: true, folder: 'inbox', isStarred: false },
    { subject: 'Project Collaboration', from: 'colleague@work.com', isRead: false, folder: 'inbox', isStarred: true },
    { subject: 'Weekend Plans', from: 'friend@personal.com', isRead: true, folder: 'sent', isStarred: false },
    { subject: 'Subscription Renewal', from: 'service@subscription.com', isRead: true, folder: 'drafts', isStarred: true },
    { subject: 'Flight Itinerary', from: 'travel@airline.com', isRead: true, folder: 'trash', isStarred: false },
    { subject: 'Security Alert', from: 'security@bank.com', isRead: false, folder: 'sent', isStarred: true },
    { subject: 'New Year Greetings', from: 'greetings@holiday.com', isRead: true, folder: 'inbox', isStarred: false },
    { subject: 'Tech Conference Invitation', from: 'events@techconference.com', isRead: false, folder: 'drafts', isStarred: true },
    { subject: 'Gym Membership Renewal', from: 'noreply@gym.com', isRead: true, folder: 'drafts', isStarred: false },
    { subject: 'Book Club Meeting', from: 'bookclub@library.com', isRead: true, folder: 'sent', isStarred: true },
    { subject: 'Dinner Reservation Confirmation', from: 'reservations@restaurant.com', isRead: true, folder: 'trash', isStarred: false },
    { subject: 'Welcome to Our Newsletter', from: 'newsletter@updates.com', isRead: false, folder: 'inbox', isStarred: true },
    { subject: 'Warranty Expiry Reminder', from: 'warranty@electronics.com', isRead: true, folder: 'sent', isStarred: false },
    { subject: 'Survey Invitation', from: 'feedback@surveys.com', isRead: false, folder: 'drafts', isStarred: true },
    { subject: 'Appointment Reminder', from: 'appointments@clinic.com', isRead: true, folder: 'trash', isStarred: false },
    { subject: 'Your Monthly Statement', from: 'statements@bank.com', isRead: false, folder: 'trash', isStarred: true },
    { subject: 'Recipe Exchange Invite', from: 'cooking@foodie.net', isRead: false, folder: 'spam', isStarred: true },
    { subject: 'Your Flight Booking Details', from: 'booking@airlines.com', isRead: true, folder: 'spam', isStarred: false },
    { subject: 'Software Update Available', from: 'support@techsolutions.com', isRead: false, folder: 'spam', isStarred: true },
    { subject: 'Local Event: Arts and Crafts Fair', from: 'events@localcommunity.org', isRead: true, folder: 'spam', isStarred: false },
    { subject: 'Annual Health Checkup Reminder', from: 'noreply@healthclinic.com', isRead: false, folder: 'spam', isStarred: false },
    ];