import { 
    SET_QUEQE, 
    SET_PLAYED_TRACKS, 
    ADD_PLAYED_TRACK, 
    REMOVE_PLAYED_TRACK, 
    SET_STATION_TRACKS_TO_PLAY, 
    REMOVE_STATION_TRACK_TO_PLAY, 
    SET_TRACKS_TO_PLAY, 
    ADD_TRACK_TO_PLAY, 
    REMOVE_TRACK_TO_PLAY, 
    SET_IS_LOADING 
} from "../reducers/queqe.reducer"
import { store } from "../store"


export async function setQueqeToStation(station, trackNum = 0) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const queqe = {
            station: station,
            playedTracks: station.tracks.slice(0, trackNum),
            stationTracksToPlay: station.tracks.slice(trackNum) || [],
            tracksToPlay: [],
        }
        store.dispatch({ type: SET_QUEQE, queqe })
        return GetCurrentTrackInQueqe()
    } catch (err) {
        console.log('Had issues Setting the queqe', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

export function GetCurrentTrackInQueqe() {
    const stationTracksToPlay = store.getState().queqeModule.stationTracksToPlay
    const tracksToPlay = store.getState().queqeModule.tracksToPlay

    if(tracksToPlay.length) return tracksToPlay[0]
    if(stationTracksToPlay.length) return stationTracksToPlay[0]
    return null
}

export async function nextTrackInQueqe() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const stationTracksToPlay = store.getState().queqeModule.stationTracksToPlay
    const tracksToPlay = store.getState().queqeModule.tracksToPlay
    let track
    try {
        if(tracksToPlay.length) {
            track = tracksToPlay[0]
            store.dispatch({ type: REMOVE_TRACK_TO_PLAY, track })
        } else {
            track = stationTracksToPlay[0]
            store.dispatch({ type: REMOVE_STATION_TRACK_TO_PLAY, track })
            store.dispatch({ type: ADD_PLAYED_TRACK, track })
        }
        return GetCurrentTrackInQueqe()
    } catch (err) {
        console.log('Had issues Setting the queqe', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

export async function prevTrackInQueqe() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const playedTracks = store.getState().queqeModule.playedTracks
    const stationTracksToPlay = store.getState().queqeModule.stationTracksToPlay
    try {
        if(playedTracks.length) {
            const track = tracksToPlay[tracksToPlay.length - 1]
            const tracks = [track, ...stationTracksToPlay]
            store.dispatch({ type: REMOVE_PLAYED_TRACK, track })
            store.dispatch({ type: SET_PLAYED_TRACK, tracks })
        }
        return GetCurrentTrackInQueqe()
    } catch (err) {
        console.log('Had issues Setting the queqe', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}
