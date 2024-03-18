import { SET_QUEUE, SET_PLAYED_TRACKS, ADD_PLAYED_TRACK, REMOVE_PLAYED_TRACK, SET_STATION_TRACKS_TO_PLAY, REMOVE_STATION_TRACK_TO_PLAY, SET_TRACKS_TO_PLAY, 
    ADD_TRACK_TO_PLAY, REMOVE_TRACK_TO_PLAY } from "../reducers/queue.reducer"
import { store } from "../store"
import { queueService } from "../../services/queue.service.js"


export async function setQueueToStation(station, trackNum = 0) {
    console.log('setQueueToStation', station, trackNum)
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const queue = {
            station: station,
            playedTracks: station.tracks.slice(0, trackNum),
            stationTracksToPlay: station.tracks.slice(trackNum) || [],
            tracksToPlay: [],
            trackNum: trackNum,
        }
        await queueService.saveQueue(queue)
        store.dispatch({ type: SET_QUEUE, queue })
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    }
}

export async function setQueueToTrack(track) {
    try {
        await queueService.saveQueue(queue)
        store.dispatch({ type: SET_QUEUE, queue })
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    }
}

export async function addTrackToQueue(track) {
    const queue = store.getState().queueModule
    try {
        await queueService.saveQueue({...queue, tracksToPlay: [...queue.tracksToPlay, track]})
        store.dispatch({ type: ADD_TRACK_TO_PLAY, track })
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    }
}

export async function playNextTrack() {
    await playAdjacentTrack(1)
}

export async function playPrevTrack() {
    await playAdjacentTrack(-1)
}

export async function playAdjacentTrack(num) {
    try {
        const station = store.getState().queueModule.station
        const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
        const currQueue = store.getState().queueModule
        const currTrackNum = currQueue.trackNum
        const newTrackNum = (currTrackNum + num) % stationTracksToPlay.length;
        setQueueToStation(station, newTrackNum)
    } catch (err) {
        console.log('Had issues getting the prev track index', err);
        throw err
    }
}

export function getCurrentTrackInQueue() {
    const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
    const tracksToPlay = store.getState().queueModule.tracksToPlay
    const playedTracks = store.getState().queueModule.playedTracks

    if(tracksToPlay.length) return tracksToPlay[0]
    if(stationTracksToPlay.length) return stationTracksToPlay[0]
    if(playedTracks.length) return playedTracks[playedTracks.length-1]
    return null
}

export async function nextTrackInQueue() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
    const tracksToPlay = store.getState().queueModule.tracksToPlay
    let track
    try {
        if(tracksToPlay.length) {
            track = tracksToPlay[0]
            store.dispatch({ type: REMOVE_TRACK_TO_PLAY, track })
        } else {
            track = stationTracksToPlay[0]
            console.log('nextTrackInQueue', track)
            store.dispatch({ type: REMOVE_STATION_TRACK_TO_PLAY, track })
            store.dispatch({ type: ADD_PLAYED_TRACK, track })
        }
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

export async function prevTrackInQueue() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const playedTracks = store.getState().queueModule.playedTracks
    const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
    const tracksToPlay = store.getState().queueModule.tracksToPlay

    try {
        if(playedTracks.length) {
            const track = tracksToPlay[tracksToPlay.length - 1]
            const tracks = [track, ...stationTracksToPlay]
            console.log('prevTrackInQueue', track)
            store.dispatch({ type: REMOVE_PLAYED_TRACK, track })
            store.dispatch({ type: SET_PLAYED_TRACKS, tracks })
        }
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

// export async function nextTrackInQueue() {
//     const tracksToPlay = store.getState().queueModule.tracksToPlay;
//     const track = tracksToPlay.length ? tracksToPlay[0] : store.getState().queueModule.stationTracksToPlay[0];
//     return handleTrackOperation(track, REMOVE_TRACK_TO_PLAY);
//     const tracksToPlay = store.getState().queueModule.tracksToPlay;
//     const track = tracksToPlay.length ? tracksToPlay[0] : store.getState().queueModule.stationTracksToPlay[0];
//     return handleTrackOperation(track, REMOVE_TRACK_TO_PLAY);
// }

// export async function prevTrackInQueue() {
//     const playedTracks = store.getState().queueModule.playedTracks;
//     const track = playedTracks.length ? playedTracks[playedTracks.length - 1] : null;
//     return handleTrackOperation(track, REMOVE_PLAYED_TRACK);
// }

// async function handleTrackOperation(track, actionType) {
//     const playedTracks = store.getState().queueModule.playedTracks;
//     const track = playedTracks.length ? playedTracks[playedTracks.length - 1] : null;
//     return handleTrackOperation(track, REMOVE_PLAYED_TRACK);
// }

// async function handleTrackOperation(track, actionType) {
//     try {
//         if (track) {
//             store.dispatch({ type: actionType, track });
//             if (actionType === REMOVE_PLAYED_TRACK) {
//                 const tracks = [track, ...store.getState().queueModule.stationTracksToPlay];
//                 store.dispatch({ type: SET_PLAYED_TRACKS, tracks });
//             }
//         if (track) {
//             store.dispatch({ type: actionType, track });
//             if (actionType === REMOVE_PLAYED_TRACK) {
//                 const tracks = [track, ...store.getState().queueModule.stationTracksToPlay];
//                 store.dispatch({ type: SET_PLAYED_TRACKS, tracks });
//             }
//         }
//         return getCurrentTrackInQueue();
//         return getCurrentTrackInQueue();
//     } catch (err) {
//         console.log('Had issues setting the queue', err);
//         throw err;
//     } finally {
//         // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
//     }
// }