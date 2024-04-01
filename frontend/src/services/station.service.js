import { storageService } from './async-storage.service.js'
import { dataService } from './data.service.js'
import { httpService } from './http.service.js'
import { preService } from './pre.service.js'

export const stationService = {
    getStations,
    saveStation,
    saveStations,
    removeById,
    getById,
    createStation,
    getDefaultFilter,
    filterURL,
    filterByUpdateHistory,
    removePreviousHistory,
    // initStations,
    // colorAnalysis,
}

// const STATION_STORAGE_KEY = 'stationDB'

async function getStations(filterBy = null) {
    // let stations = await storageService.query(STATION_STORAGE_KEY) // add filter later
    let stations = await httpService.get(`station`)

    if (!filterBy) return stations

    // apply filtering 
    if (filterBy) {
        if (filterBy.text) {
            stations = stations.filter(station => {
                const textMatch = !filterBy.text || station.name.includes(filterBy.text)
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

async function getById(stationId) {
    return await httpService.get(`station/${stationId}`)
}

async function removeById(stationId) {
    return await httpService.delete(`station/${stationId}`)
}

async function saveStation(station) {
    if (station._id) {
        return await httpService.put(`station/${station._id}`, station)
    } else {
        return await httpService.post(`station/`, station)
    }
}

async function saveStations(stations) {
    try {
        const savedStations = await Promise.all(stations.map(station => saveStation(station)));
        return savedStations;
    } catch (err) {
        console.error("Error saving stations:", err);
        throw err;
    }
}

function createStation(name, createdBy, imgUrl = 'blank') {
    return {
        name: name,
        description: '',
        tags: [],
        imgUrl: imgUrl,
        createdBy: createdBy,
        likedByUsers: [],
        tracks: [],
        msgs: [],
        isPublic: false,
    }
}

function getDefaultFilter(params) {
    return {
        tab: params.tab || "home",
        text: params.text || "",
        collectionId: params.collectionId || "",
        tabHistory: params.tab === "station" || params.tab === "genre" ? [`${params.tab} ${params.collectionId}`] : [params.tab],
        tabHistoryLoc: 0,
    }
}

function filterURL(filterBy) {
    let url = `/melodiva/${filterBy.tab || 'home'}`;
    const queryParams = new URLSearchParams();

    if (filterBy.text) {
        queryParams.append('text', filterBy.text);
    }
    if (filterBy.collectionId) {
        url += `/${filterBy.collectionId}`;
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`;
    }
    return url;
}

function filterByUpdateHistory(prevFilterBy, newFilterBy) {
    const { tab, collectionId } = newFilterBy
    var newTabHistoryItem
    if(tab.includes("station") || tab.includes("genre")) {
        newTabHistoryItem =  `${tab} ${collectionId}`
    } else {
        newTabHistoryItem = tab
    }

    return {
        ...newFilterBy, 
        tabHistory: [...stationService.removePreviousHistory(prevFilterBy.tabHistory, prevFilterBy.tabHistoryLoc), newTabHistoryItem], 
        tabHistoryLoc: prevFilterBy.tabHistoryLoc + 1
    }
}

function removePreviousHistory(arr, loc) {
    const elementsToRemove = arr.length - (loc + 1)

    if (elementsToRemove > 0)
        arr.splice(-elementsToRemove);
    return arr
}


// async function colorAnalysis(imageURL) {
//     try {
//         const corsAnywhereURL = 'https://cors-anywhere.herokuapp.com/';
//         const response = await fetch(corsAnywhereURL + imageURL);
//         const blob = await response.blob();

//         const image = new Image();
//         image.src = URL.createObjectURL(blob);

//         return new Promise((resolve, reject) => {
//             image.onload = () => {
//                 const canvas = document.createElement('canvas');
//                 canvas.width = image.width;
//                 canvas.height = image.height;
//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(image, 0, 0, image.width, image.height);

//                 const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
//                 const colorCounts = {};
//                 let maxCount = 0;
//                 let mostCommon = null;

//                 for (let i = 0; i < imageData.length; i += 4) {
//                     const r = imageData[i];
//                     const g = imageData[i + 1];
//                     const b = imageData[i + 2];
//                     const color = `rgb(${r},${g},${b})`;

//                     if (!colorCounts[color]) {
//                         colorCounts[color] = 0;
//                     }

//                     colorCounts[color]++;

//                     if (colorCounts[color] > maxCount) {
//                         maxCount = colorCounts[color];
//                         mostCommon = color;
//                     }
//                 }

//                 resolve(mostCommon);
//             };

//             image.onerror = (error) => {
//                 reject(error);
//             };
//         });
//     } catch (error) {
//         console.error('Error analyzing image:', error);
//         return null;
//     }
// }

// async function initStations() {
//     const stationDefault = require('../assets/JSON/stationDefault.json');
//     const stationTLI = require('../assets/JSON/stationTLI.json');

//     utilService.saveToStorage(STATION_STORAGE_KEY, [stationDefault, stationTLI]);
// }
