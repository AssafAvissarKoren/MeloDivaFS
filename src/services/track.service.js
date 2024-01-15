import imgTLI from '../assets/imgs/the lonely island - tutleneck & chain.png';
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { statsService } from './stats.service.js'
import { eventBusService } from './event-bus.service.js'

export const songService = {
    initSongs,
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

const SONG_STORAGE_KEY = 'songDB'

function getFolders() {
    return ["Inbox", "Spam", "Trash"];
}

async function queryEmails(filterBy) {
    let emails = await songService.getEmails();

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
    let url = `/melodiva/${filterBy.folder || 'inbox'}`;
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
    return storageService.query(SONG_STORAGE_KEY);
}

function getById(id) {
    return storageService.get(SONG_STORAGE_KEY, id);
}

function removeEmail(id) {
    return storageService.remove(SONG_STORAGE_KEY, id);
}

async function saveEmail(emailToSave, folderName = "inbox") {
    const savedEmail = {...emailToSave, folder: folderName, isChecked: false};
    let newEmail
    if (savedEmail.id) {
        newEmail = await storageService.put(SONG_STORAGE_KEY, savedEmail);
    } else {
        newEmail = await storageService.post(SONG_STORAGE_KEY, savedEmail);
    }
    await statsService.createStats();
    return newEmail
}

function getDefaultFilter(params) {
    return {
        folder: params.tab || "home",
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
    utilService.saveToStorage(SONG_STORAGE_KEY, updatedAllEmails);
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

async function initSongs() {
    const savedSongs = defaultContent.map(song => ({
        ...song,
        coverImage: imgTLI,
        likes: 0,
      }));
    utilService.saveToStorage(SONG_STORAGE_KEY, savedSongs);
    // statsService.createStats();
}
    
const defaultContent = [
    { _id: "GI6CfKcMhjY", title: "Jack Sparrow", artist: "The Lonely Island", featuredArtist: ["Michael Bolton"] },
    { _id: "Jr9Kaa1sycs", title: "Finest Girl (Bin Laden Song) - Uncensored Version", artist: "The Lonely Island", featuredArtist: [] },
    { _id: "BKQ6nINAeq8", title: "Go Kindergarten", artist: "The Lonely Island", featuredArtist: ["Robyn", "Sean Combs", "Paul Rudd"] },
    { _id: "avaSdC0QOUM", title: "I'm On A Boat", artist: "The Lonely Island", featuredArtist: ["T-Pain"] },
    { _id: "8yvEYKRF5IA", title: "Boombox", artist: "The Lonely Island", featuredArtist: ["Julian Casablancas"] },
    { _id: "NisCkxU544c", title: "Like A Boss", artist: "The Lonely Island", featuredArtist: ["Seth Rogen"] },
    { _id: "jUw4Qh9uFK8", title: "Spring Break Anthem", artist: "The Lonely Island", featuredArtist: [] }
  ];
  
