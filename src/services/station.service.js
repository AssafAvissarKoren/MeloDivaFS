import imgTLI from '../assets/imgs/the lonely island - tutleneck & chain.png';
import imgRHCP from '../assets/imgs/FunkyMonks.png';
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { statsService } from './stats.service.js'
import { eventBusService } from './event-bus.service.js'

export const stationService = {
    initStations,
    queryStations,
    saveStation,
    removeStation,
    getStationById,
    createStation,
    getDefaultFilter,
    getStations,
    filterURL,
    backOneURLSegment,
    getTabs,
    onDeleteStation,
    updateBatchStations,
}

const STATION_STORAGE_KEY = 'stationDB'

function getTabs() {
    return ["home", "search", "library"];
}

async function queryStations(filterBy) {
    let stations = await getStations();

    // Apply filtering based on the provided filter criteria
    if (filterBy) {
        if (filterBy.text) {
            stations = stations.filter(station => {
                const textMatch = !filterBy.text || station.name.includes(filterBy.text);
                return textMatch;
            });
        }
    }

    return stations;
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

function getStations() {
    return storageService.query(STATION_STORAGE_KEY);
}

function getStationById(id) {
    return storageService.get(STATION_STORAGE_KEY, id);
}

function removeStation(id) {
    return storageService.remove(STATION_STORAGE_KEY, id);
}

async function saveStation(stationToSave, songToSave = null) {
    if (songToSave) {
        stationToSave.songs = [...stationToSave.songs, songToSave];
    }

    let savedStation;
    if (stationToSave.songs.length === 0) {
        savedStation = await storageService.post(STATION_STORAGE_KEY, stationToSave);
    } else {
        savedStation = await storageService.put(STATION_STORAGE_KEY, stationToSave);
    }
    await statsService.createStats();
    return savedStation;
}


function getDefaultFilter(params) {
    return {
        tab: params.tab || "home",
        text: params.text || "",
    };
}


function createStation(user, stationName, tags) {
    return {
        _id: null,
        name: stationName,
        tags: tags,
        createdBy: {
            _id: user._id,
            fullname: user.fullname,
            imgUrl: null,
        },
        likedByUsers: [],
        songs: [],
        msgs: []
    };
}

function backOneURLSegment(navigate) {
    const pathArray = window.location.hash.split('/');
    const newPath = '/' + pathArray.slice(1, pathArray.length - 1).join('/');
    navigate(newPath);
}

async function onDeleteStation(email) {
    if(email.folder === "trash") {
        await removeStation(email.id);
        eventBusService.showSuccessMsg('Email deleted successfully');
    } else {
        await saveStation(email, "trash");
        eventBusService.showSuccessMsg('Email moved to Trash folder successfully');
    }
    statsService.createStats();
};

async function updateBatchStations(updatedEmails) {
    const allEmails = await getStations();
    const updatedAllEmails = await _updateEmailLists(updatedEmails, allEmails);
    utilService.saveToStorage(STATION_STORAGE_KEY, updatedAllEmails);
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

async function initStations() {
    utilService.saveToStorage(STATION_STORAGE_KEY, [stationDefault, stationTLI]);
}
    
var stationDefault = {
    _id: "5cksxjas89xjsa8xjsa8jxs09",
    name: "Funky Monks",
    tags: [
        "Funk",
        "Happy"
    ],
    createdBy: {
        _id: "u101",
        fullname: "Puki Ben David",
        imgUrl: imgRHCP
    },
    likedByUsers: ['{minimal-user}', '{minimal-user}'],
    songs: [
        {
            id: "s1001",
            title: "The Meters - Cissy Strut",
            url: "youtube/song.mp4",
            imgUrl: "https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg",
            addedBy: '{minimal-user}',
            addedAt: 162521765262
        },
        {
            id: "mUkfiLjooxs",
            title: "The JB's - Pass The Peas",
            url: "youtube/song.mp4",
            imgUrl: "https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg",
            addedBy: {}
        },
    ],
    msgs: [
        {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?'
        }
    ]
}

var stationTLI = {
    _id: "st109",
    name: "The Lonely Island",
    tags: [
        "Hip-Hop",
        "Pop",
        "Sketch Comedy",
    ],
    createdBy: {
        _id: "u101",
        fullname: "Puki Ben David",
        imgUrl: imgTLI,
    },
    likedByUsers: ['{minimal-user}', '{minimal-user}'],
    songs: [
        { 
            _id: "s10101", 
            title: "The Lonely Island - Jack Sparrow", 
            url: "GI6CfKcMhjY", 
            imgUrl: imgTLI, 
            addedBy: '{minimal-user}', 
            addedAt: 162236125356 
        },
        { 
            _id: "s10102", 
            title: "The Lonely Island - Finest Girl (Bin Laden Song) - Uncensored Version", 
            url: "Jr9Kaa1sycs", 
            imgUrl: imgTLI, 
            addedBy: '{minimal-user}', 
            addedAt: 160001810248 
        },
        { 
            _id: "s10103", 
            title: "The Lonely Island - Go Kindergarten", 
            url: "BKQ6nINAeq8", 
            imgUrl: imgTLI,  
            addedBy: '{minimal-user}', 
            addedAt: 161852128293 
        },
        { 
            _id: "s10104", 
            title: "The Lonely Island - I'm On A Boat", 
            url: "avaSdC0QOUM", 
            imgUrl: imgTLI,  
            addedBy: '{minimal-user}', 
            addedAt: 164672153990 
        },
        { 
            _id: "s10104", 
            title: "The Lonely Island - Boombox", 
            url: "8yvEYKRF5IA", 
            imgUrl: imgTLI,  
            addedBy: '{minimal-user}', 
            addedAt: 160506213013 
        },
        { 
            _id: "s10104", 
            title: "The Lonely Island - Like A Boss", 
            url: "NisCkxU544c", 
            imgUrl: imgTLI,  
            addedBy: '{minimal-user}', 
            addedAt: 164389180962 
        },
        { 
            _id: "s10104", 
            title: "The Lonely Island - Spring Break Anthem", 
            url: "jUw4Qh9uFK8", 
            imgUrl: imgTLI,  
            addedBy: '{minimal-user}', 
            addedAt: 160846710840 
        },
    ],
    msgs: [
        {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?'
        }
    ]
}
  
