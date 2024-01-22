import { storageService } from './async-storage.service.js'
import { createStationData } from './data.service.js'

export const stationService = {
    initStations,
    getStations,
    saveStation,
    removeById,
    getById,
    createStation,
    getDefaultFilter,
    filterURL,
}

const STATION_STORAGE_KEY = 'stationDB'

createStationData(STATION_STORAGE_KEY)

async function initStations() {
    const stationDefault = require('../assets/JSON/stationDefault.json');
    const stationTLI = require('../assets/JSON/stationTLI.json');

    utilService.saveToStorage(STATION_STORAGE_KEY, [stationDefault, stationTLI]);
}

async function getStations(filterBy = null) {
    let stations = await storageService.query(STATION_STORAGE_KEY) // add filter later
    if (!filterBy) return stations

    // apply filtering 
    if (filterBy) {
        if (filterBy.text) {
            stations = stations.filter(station => {
                const textMatch = !filterBy.text || station.title.includes(filterBy.text)
                return textMatch;
            });
        }
    }

    // apply sorting
    switch (filterBy.sort) {
        case 'title':
            stations.sort((a, b) => a.subject.localeCompare(b.subject));
            break;
    }

    return stations
}

function getById(stationId) {
    return storageService.get(STATION_STORAGE_KEY, stationId)
}

function removeById(stationId) {
    return storageService.remove(STATION_STORAGE_KEY, stationId)
}

function saveStation(station) {
    if (station._id) {
        return storageService.put(STATION_STORAGE_KEY, station)
    } else {
        return storageService.post(STATION_STORAGE_KEY, station)
    }
}

function createStation(name = '', createdBy) {
    return {
        name: name,
        tags: [],
        createdBy: createdBy,
        likedByUsers: [],
        tracks: [],
        msgs: []
    }
}

function getDefaultFilter(params) {
    return {
        tab: params.tab || "home",
        text: params.text || "",
    }
}

function filterURL(filterBy) {
    let url = `/melodiva/${filterBy.tab || 'home'}`;
    const queryParams = new URLSearchParams();

    if (filterBy.text) {
        queryParams.append('text', filterBy.text);
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`;
    }
    return url;
}

// import imgTLI from '../assets/imgs/the lonely island - tutleneck & chain.png';
// import imgRHCP from '../assets/imgs/FunkyMonks.png';
// import { storageService } from './async-storage.service.js'
// import { utilService } from './util.service.js'
// import { userService } from './user.service.js'
// import { statsService } from './stats.service.js'
// import { eventBusService } from './event-bus.service.js'

// export const stationService = {
//     initStations,
//     queryStations,
//     saveStation,
//     removeStation,
//     getStationById,
//     createStation,
//     getDefaultFilter,
//     getStations,
//     filterURL,
//     backOneURLSegment,
//     getTabs,
//     onDeleteStation,
//     updateBatchStations,
// }

// const STATION_STORAGE_KEY = 'stationDB'

// function getTabs() {
//     return ["home", "search", "library"];
// }

// async function queryStations(filterBy) {
//     let emails = await getStations();

//     // Apply filtering based on the provided filter criteria
//     if (filterBy) {
//         if (filterBy.folder) {
//             if (filterBy.folder === 'starred') {
//                 emails = emails.filter(email => email.isStarred);
//             } else {
//                 emails = emails.filter(email => email.folder === filterBy.folder);
//             }
//         }

//         if (filterBy.text || filterBy.isRead !== null) {
//             emails = emails.filter(email => {
//                 const textMatch = !filterBy.text || email.subject.includes(filterBy.text) || email.body.includes(filterBy.text) || email.from.includes(filterBy.text);
//                 const isReadMatch = filterBy.isRead === null || email.isRead === filterBy.isRead;
//                 return textMatch && isReadMatch;
//             });
//         }
//     }

//     // Sort the emails based on the filter criteria
//     switch (filterBy.sort) {
//         case 'date':
//             emails.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
//             break;
//         case 'title':
//             emails.sort((a, b) => a.subject.localeCompare(b.subject));
//             break;
//         // Add more sort cases if necessary
//     }

//     // Link emails with their next and previous emails
//     if (emails.length > 0) {
//         emails[0].prevEmailId = null;
//         emails[0].listIndex = 1; // Start index at 1

//         for (let i = 1; i < emails.length; i++) {
//             emails[i].prevEmailId = emails[i - 1].id;
//             emails[i - 1].nextEmailId = emails[i].id;
//             emails[i].listIndex = i + 1;
//         }

//         emails[emails.length - 1].nextEmailId = null; // Last email's nextEmailId is null
//     }

//     return emails;
// }

// function filterURL(filterBy) {
//     let url = `/melodiva/${filterBy.tab || 'home'}`;
//     const queryParams = new URLSearchParams();

//     if (filterBy.text) {
//         queryParams.append('text', filterBy.text);
//     }
//     if ([...queryParams].length) {
//         url += `?${queryParams}`;
//     }
//     return url;
// }

// function getStations() {
//     return storageService.query(STATION_STORAGE_KEY);
// }

// function removeStation(id) {
//     return storageService.remove(STATION_STORAGE_KEY, id);
// }

// async function saveStation(emailToSave, folderName = "inbox") {
//     const savedEmail = {...emailToSave, folder: folderName, isChecked: false};
//     let newEmail
//     if (savedEmail.id) {
//         newEmail = await storageService.put(STATION_STORAGE_KEY, savedEmail);
//     } else {
//         newEmail = await storageService.post(STATION_STORAGE_KEY, savedEmail);
//     }
//     await statsService.createStats();
//     return newEmail
// }

// function getDefaultFilter(params) {
//     return {
//         tab: params.tab || "home",
//         text: params.text || "",
//     };
// }

// async function createStation(
//     subject = "", 
//     body = "", 
//     to = "", 
//     folder = "inbox", 
//     from = null, 
//     sentAt = new Date().getTime(), 
//     isRead = null, 
//     isStarred = false,
//     location = null,
// ) {
//     let newLocation;
//     if(!location) {
//         try {
//             newLocation = await getLocation();
//         } catch (err) {
//             console.error('Error fetching location:', err);
//             newLocation = { latitude: null, longitude: null };
//         }
//     } else {
//         newLocation = location;
//     }
    
//     let newFrom;
//     if(!from) {
//         try {
//             newFrom = await userService.getUser().email;
//         } catch (err) {
//             console.error('Error fetching location:', err);
//             newFrom = null;
//         }
//     } else {
//         newFrom = from;
//     }

//     return { 
//         id: null,
//         subject: subject, 
//         body: body, 
//         isRead: isRead, 
//         isStarred: isStarred,
//         sentAt: sentAt, 
//         removedAt: null, 
//         from: newFrom, 
//         to: to,
//         folder: folder,
//         prevEmailId: null,
//         nextEmailId: null,
//         listIndex: null,
//         isChecked: false,
//         location: newLocation,
//     }
// }

// const getLocation = () => {
//     return new Promise((resolve, reject) => {
//         if (!navigator.geolocation) {
//             reject('Geolocation is not supported by this browser.');
//         }
//         navigator.geolocation.getCurrentPosition(
//             position => {
//                 const { latitude, longitude } = position.coords;
//                 resolve({ latitude, longitude });
//             }, 
//             err => {
//                 reject(err);
//             }
//         );
//     });
// };

// function backOneURLSegment(navigate) {
//     const pathArray = window.location.hash.split('/');
//     const newPath = '/' + pathArray.slice(1, pathArray.length - 1).join('/');
//     navigate(newPath);
// }

// async function onDeleteStation(email) {
//     if(email.folder === "trash") {
//         await removeStation(email.id);
//         eventBusService.showSuccessMsg('Email deleted successfully');
//     } else {
//         await saveStation(email, "trash");
//         eventBusService.showSuccessMsg('Email moved to Trash folder successfully');
//     }
//     statsService.createStats();
// };

// async function updateBatchStations(updatedEmails) {
//     const allEmails = await getStations();
//     const updatedAllEmails = await _updateEmailLists(updatedEmails, allEmails);
//     utilService.saveToStorage(STATION_STORAGE_KEY, updatedAllEmails);
// }


// async function _updateEmailLists (updatedEmails, currentEmails) {
//     const updatedHashMap = {};
//     const currentHashMap = {};
//     updatedEmails.forEach((updatedEmail, index) => {
//         updatedHashMap[updatedEmail.id] = index;
//     });
//     currentEmails.forEach((currentEmail, index) => {
//         currentHashMap[currentEmail.id] = index;
//     });
//     const mergedEmailList = currentEmails.map(currentEmail => {
//         if (updatedHashMap.hasOwnProperty(currentEmail.id)) {
//             return updatedEmails[updatedHashMap[currentEmail.id]];
//         }
//         return currentEmail;
//     });
//     return mergedEmailList;
// }