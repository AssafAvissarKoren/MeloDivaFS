import { SET_QUEUE, SET_PLAYED_TRACKS, ADD_PLAYED_TRACK, REMOVE_PLAYED_TRACK, SET_STATION_TRACKS_TO_PLAY, REMOVE_STATION_TRACK_TO_PLAY, SET_TRACKS_TO_PLAY, 
    ADD_TRACK_TO_PLAY, REMOVE_TRACK_TO_PLAY, SET_IS_LOADING } from "../reducers/queue.reducer"
import { store } from "../store"
import { queueService } from "../../services/queue.service.js"


export async function setQueueToStation(station, trackNum = 0) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const queue = {
            station: station,
            playedTracks: station.tracks.slice(0, trackNum),
            stationTracksToPlay: station.tracks.slice(trackNum) || [],
            tracksToPlay: [],
        }
        await queueService.saveQueue(queue)
        store.dispatch({ type: SET_QUEUE, queue })
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

export async function setQueueToTrack(track) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const queue = {
            station: null,
            playedTracks: track,
            stationTracksToPlay: [],
            tracksToPlay: [],
        }
        await queueService.saveQueue(queue)
        store.dispatch({ type: SET_QUEUE, queue })
        // console.log("setQueueToTrack", getCurrentTrackInQueue())
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}


export function getCurrentTrackInQueue() {
    const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
    const tracksToPlay = store.getState().queueModule.tracksToPlay
    const playedTracks = store.getState().queueModule.playedTracks

    if(tracksToPlay.length) return tracksToPlay[0]
    if(stationTracksToPlay.length) return stationTracksToPlay[0]
    if(playedTracks) return playedTracks
    return null
}

export async function nextTrackInQueue() {
    const tracksToPlay = store.getState().queueModule.tracksToPlay;
    const track = tracksToPlay.length ? tracksToPlay[0] : store.getState().queueModule.stationTracksToPlay[0];
    return handleTrackOperation(track, REMOVE_TRACK_TO_PLAY);
}

export async function prevTrackInQueue() {
    const playedTracks = store.getState().queueModule.playedTracks;
    const track = playedTracks.length ? playedTracks[playedTracks.length - 1] : null;
    return handleTrackOperation(track, REMOVE_PLAYED_TRACK);
}

async function handleTrackOperation(track, actionType) {
    try {
        if (track) {
            store.dispatch({ type: actionType, track });
            if (actionType === REMOVE_PLAYED_TRACK) {
                const tracks = [track, ...store.getState().queueModule.stationTracksToPlay];
                store.dispatch({ type: SET_PLAYED_TRACKS, tracks });
            }
        }
        return getCurrentTrackInQueue();
    } catch (err) {
        console.log('Had issues setting the queue', err);
        throw err;
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

// export async function nextTrackInQueue() {
//     // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
//     const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
//     const tracksToPlay = store.getState().queueModule.tracksToPlay
//     let track
//     try {
//         if(tracksToPlay.length) {
//             track = tracksToPlay[0]
//             store.dispatch({ type: REMOVE_TRACK_TO_PLAY, track })
//         } else {
//             track = stationTracksToPlay[0]
//             store.dispatch({ type: REMOVE_STATION_TRACK_TO_PLAY, track })
//             store.dispatch({ type: ADD_PLAYED_TRACK, track })
//         }
//         return getCurrentTrackInQueue()
//     } catch (err) {
//         console.log('Had issues Setting the queue', err);
//         throw err
//     } finally {
//         // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
//     }
// }

// export async function prevTrackInQueue() {
//     // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
//     const playedTracks = store.getState().queueModule.playedTracks
//     const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
//     try {
//         if(playedTracks.length) {
//             const track = tracksToPlay[tracksToPlay.length - 1]
//             const tracks = [track, ...stationTracksToPlay]
//             store.dispatch({ type: REMOVE_PLAYED_TRACK, track })
//             store.dispatch({ type: SET_PLAYED_TRACKS, tracks })
//         }
//         return getCurrentTrackInQueue()
//     } catch (err) {
//         console.log('Had issues Setting the queue', err);
//         throw err
//     } finally {
//         // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
//     }
// }

