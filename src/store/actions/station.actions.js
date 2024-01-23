import { stationService } from "../../services/station.service";
import { trackService } from "../../services/track.service";
import { ADD_STATION, REMOVE_STATION, SET_FILTER_BY, SET_IS_LOADING, SET_STATIONS, UPDATE_STATION, SET_LIKED_TRACKS, ADD_LIKED_TRACK, REMOVE_LIKED_TRACK } from "../reducers/station.reducer";
import { store } from "../store";



export async function loadStations() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const filterBy = store.getState().stationModule.filterBy
    try {
        const stations = await stationService.query(filterBy)
        
        store.dispatch({ type: SET_STATIONS, stations })
    } catch (err) {
        console.log('Had issues loading stations', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }

}

export async function getStationById(stationId) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        return await stationService.getById(stationId)
    } catch (err) {
        console.log('Had issues Getting station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeStation(stationId) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        await stationService.removeById(stationId)
        store.dispatch({ type: REMOVE_STATION, stationId })
    } catch (err) {
        console.log('Had issues Removing station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function saveStation(stationToSave) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const type = stationToSave._id ? UPDATE_STATION : ADD_STATION
    try {
        const savedStation = await stationService.saveStation(stationToSave)
        store.dispatch({ type, station: savedStation })
    } catch (err) {
        console.log('Had issues saving station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export async function initLikedTracks() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const likedTracks = await trackService.initLikedTracks()
        console.log(likedTracks)
        store.dispatch({ type: SET_LIKED_TRACKS, likedTracks })
    } catch (err) {
        console.log('Had issues Initalizing liked tracks', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
} 

export function toggleLikedTrack(track) {
    const likedTracks = store.getState().stationModule.likedTracks
    if(likedTracks[track.url]) removeLikedTrack(likedTracks, track)
    else addLikedTrack(likedTracks, track)
}

async function addLikedTrack(likedTracks, track) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        trackService.setLikedTracks({...likedTracks, [track.url]: track})
        store.dispatch({ type: ADD_LIKED_TRACK, track })
    } catch (err) {
        console.log('Had issues Adding station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

async function removeLikedTrack(likedTracks, track) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    likedTracks = {...likedTracks}
    delete likedTracks[track.url]
    try {
        trackService.setLikedTracks(likedTracks)
        store.dispatch({ type: REMOVE_LIKED_TRACK, track })
    } catch (err) {
        console.log('Had issues Removing station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export function setIsLoading(isLoading) {
    store.dispatch({ type: SET_IS_LOADING, isLoading })
}