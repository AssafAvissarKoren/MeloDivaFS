import { storageService } from './async-storage.service.js'
import { dataService } from './data.service.js'

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

dataService.createStationData(STATION_STORAGE_KEY)

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
        stationId: params.stationId || "",
    }
}

function filterURL(filterBy) {
    let url = `/melodiva/${filterBy.tab || 'home'}`;
    const queryParams = new URLSearchParams();

    if (filterBy.text) {
        queryParams.append('text', filterBy.text);
    }
    if (filterBy.stationId) {
        url += `/${filterBy.stationId}`;
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`;
    }
    console.log("filterURL", url)
    return url;
}
