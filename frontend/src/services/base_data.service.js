import axios from "axios"
import { httpService } from './http.service.js'
import { stationService } from "./station.service.js"
import { userService } from "./user.service.js"
import { store } from '../store/store.js'
import { utilService } from "./util.service.js"

const STATION_API_URL = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50'

export const base_dataService = {
    getStations,
    getCategories,
    createStationData,
}

async function getStations() {
    return await httpService.get(`base_data/stations`)
}

async function getCategories() {
    return await httpService.get(`base_data/categories`)
}

async function createStationData() {
    // let stations = utilService.loadFromStorage(storageKey);
    let stations = store.getState().stationModule.stations
    const defaultStations = await base_dataService.getStations()

    if (!stations || !stations.length) {
        stations = [];
        var likedByUser = 1
        for (const { _id, name, description, artist, createdBy, tags, playlistId, mostCommonColor } of defaultStations) {
            console.log(name, playlistId)
            const newStation = await _createStation(likedByUser++, _id, name, description, artist, createdBy, tags, playlistId, mostCommonColor);
            const newStationWithDurations = await dataService.setVideoDurations(newStation)
            stations.push(newStationWithDurations);
        }
        await stationService.saveStations(stations)
    }
}

async function _createStation(likedByUser, stationId, name, description, artist, createdBy, tags, playlistId, mostCommonColor) {
    let tracks = await _ajaxGetStationTracks(playlistId);
    tracks = tracks.map(track => _createTrack(track, createdBy));


    let imgUrl = 'default_thumbnail_url';
    for (const track of tracks) {
        if (track.imgUrl !== 'default_thumbnail_url') {
            imgUrl = track.imgUrl;
            break;
        }
    }

    return {
        _id: stationId,
        name,
        description,
        artist,
        imgUrl,
        tags,
        createdBy,
        likedByUsers: likedByUser % 15 === 0 ? [await userService.getUser(), Users.u02, Users.u03] : [Users.u02, Users.u03],
        tracks,
        mostCommonColor,
        msgs: [
            {
                id: 'm101',
                from: createdBy,
                txt: utilService.makeLoremWords(5),
            }
        ]
    };
}

async function _ajaxGetStationTracks(stationId) {
    try {
        const res = await axios.get(`${STATION_API_URL}&playlistId=${stationId}&key=${API_KEY}`)
        return res.data.items
    } catch (err) {
        console.error(err)
        throw err
    }
}

function _createTrack(track, addedBy) {
    const snippet = track.snippet || {};
    const resourceId = snippet.resourceId || {};
    const thumbnails = snippet.thumbnails || {};
    const standard = thumbnails.standard || {};

    return {
        title: snippet.title || 'Unknown Title',
        artist: snippet.channelTitle || 'Unknown Artist',
        url: resourceId.videoId || 'Unknown Video ID',
        imgUrl: standard.url || 'default_thumbnail_url',
        addedBy: addedBy
    };
}
