import { SET_QUEUE, SET_CURRENT_TRACK, SET_PLAYED_TRACKS, ADD_PLAYED_TRACK, REMOVE_PLAYED_TRACK, SET_STATION_TRACKS_TO_PLAY, REMOVE_STATION_TRACK_TO_PLAY, SET_TRACKS_TO_PLAY, 
    ADD_TRACK_TO_PLAY, REMOVE_TRACK_TO_PLAY } from "../reducers/queue.reducer"
import { store } from "../store"
import { queueService } from "../../services/queue.service.js"


export async function setQueueToStation(station, trackNum = 0) {
    // console.log('setQueueToStation', station, trackNum)
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const playedTracks = station.tracks.slice(0, trackNum)
        const stationTracksToPlay = station.tracks.slice(trackNum) || []
        const tracksToPlay = []

        let currentTrack = null;

        if (tracksToPlay.length) {
            currentTrack = tracksToPlay[0];
        } else if (stationTracksToPlay.length) {
            currentTrack = stationTracksToPlay[0];
        } else if (playedTracks.length) {
            currentTrack = playedTracks[playedTracks.length - 1];
        }

        const queue = {
            station: station,
            playedTracks: playedTracks,
            stationTracksToPlay: stationTracksToPlay,
            tracksToPlay: tracksToPlay,
            trackNum: trackNum,
            currentTrack: currentTrack,
        }
        queueService.saveQueue(queue)
        store.dispatch({ type: SET_QUEUE, queue })
        console.log('setQueueToStation', store.getState().queueModule.currentTrack)
        return store.getState().queueModule.currentTrack
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    }
}

export async function setCurrentTrackInQueue() {
    try {
        const currQueue = store.getState().queueModule
        const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
        const tracksToPlay = store.getState().queueModule.tracksToPlay
        const playedTracks = store.getState().queueModule.playedTracks

        let currentTrack = null;

        if (tracksToPlay.length) {
            currentTrack = tracksToPlay[0];
        } else if (stationTracksToPlay.length) {
            currentTrack = stationTracksToPlay[0];
        } else if (playedTracks.length) {
            currentTrack = playedTracks[playedTracks.length - 1];
        }

        const newQueue = {
            ...currQueue,
            currentTrack
        }
        queueService.saveQueue(newQueue)
        store.dispatch({ type: SET_QUEUE, newQueue })
    } catch (err) {
        console.log('Had issues Setting the current track in queue', err);
        throw err
    }
}


export async function setQueueToTrack(track) {
    try {
        const queue = {
            station: null,
            currentTrack: { track: track, isStationSource: false },
            playedTracks: [],
            stationTracksToPlay: [],
            tracksToPlay: [],
        }
        console.log(queue)
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
        console.log({...queue, tracksToPlay: [...queue.tracksToPlay, track]})
        await queueService.saveQueue({...queue, tracksToPlay: [...queue.tracksToPlay, track]})
        store.dispatch({ type: ADD_TRACK_TO_PLAY, track })
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    }
}

export async function playNextTrack(random = false) {
    console.log('playNextTrack', random)
    await _playAdjacentTrack(1, random)
}

export async function playPrevTrack(random = false) {
    // console.log('playNextTrack', random)
    await _playAdjacentTrack(-1, random)
}

export async function _playAdjacentTrack(num, random) {
    try {  
        const station = store.getState().queueModule.station
        const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
        const stationLength = stationTracksToPlay.length
        const currNum = random ? Math.floor(Math.random() * stationLength) : num ;
        const currTrackNum = store.getState().queueModule.trackNum
        const newTrackNum = (currTrackNum + currNum) % stationLength;
        console.log('_playAdjacentTrack', "num", num, "random", random, "currNum", currNum, "newTrackNum", newTrackNum, "currTrackNum", currTrackNum)

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
    }
}

export async function playPrevTrack() {
    const queue = store.getState().queueModule
    try {
        if (!queue.playedTracks.length) return null

        const newQueue = {
            station: queue.station,
            currentTrack: { track: queue.playedTracks[queue.playedTracks.length-1], isStationSource: true },
            playedTracks: queue.playedTracks.slice(0, queue.playedTracks.length-2) || [],
            stationTracksToPlay: queue.currentTrack.isStationSource ? [queue.currentTrack.track, ...queue.stationTracksToPlay] : queue.stationTracksToPlay,
            tracksToPlay: queue.tracksToPlay,
        }

        console.log(queue)
        await queueService.saveQueue(newQueue)
        store.dispatch({ type: SET_QUEUE, queue: newQueue })
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    }
}

export function getCurrentTrackInQueue() {
    const currentTrack = store.getState().queueModule?.currentTrack.track
    return currentTrack
}

export function getQueuedStaion() {
    const queuedStation = store.getState().queueModule.station
    const currentTrack = store.getState().queueModule.currentTrack
    return currentTrack.isStationSource ? queuedStation : null
}


// export async function playNextTrack() {
//     await playAdjacentTrack(1)
// }

// export async function playPrevTrack() {
//     await playAdjacentTrack(-1)
// }

// export async function playAdjacentTrack(num) {
//     try {
//         const station = store.getState().queueModule.station
//         const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
//         const currQueue = store.getState().queueModule
//         const currTrackNum = currQueue.trackNum
//         const newTrackNum = (currTrackNum + num) % stationTracksToPlay.length;
//         setQueueToStation(station, newTrackNum)
//     } catch (err) {
//         console.log('Had issues getting the prev track index', err);
//         throw err
//     }
// }