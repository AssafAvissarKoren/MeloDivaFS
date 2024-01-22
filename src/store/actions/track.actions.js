import { trackService } from "../../services/track.service";
import { ADD_TRACK, REMOVE_TRACK, SET_FILTER_BY, SET_IS_LOADING, SET_TRACKS, UPDATE_TRACK } from "../reducers/track.reducer";
import { store } from "../store";



export async function loadtracks() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const filterBy = store.getState().trackModule.filterBy
    try {
        const tracks = await trackService.query(filterBy)
        store.dispatch({ type: SET_TRACKS, tracks })
    } catch (err) {
        console.log('Had issues loading tracks', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }

}

export async function removeTrack(trackId) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        await trackService.remove(trackId)
        store.dispatch({ type: REMOVE_TRACK, trackId })
    } catch (err) {
        console.log('Had issues Removing track', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function saveTrack(trackToSave) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const type = trackToSave._id ? UPDATE_TRACK : ADD_TRACK
    try {
        const savedTrack = await trackService.save(trackToSave)
        store.dispatch({ type, track: savedTrack })
    } catch (err) {
        console.log('Had issues saving track', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export function setIsLoading(isLoading) {
    store.dispatch({ type: SET_IS_LOADING, isLoading })
}