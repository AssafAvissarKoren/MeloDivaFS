import { SET_QUEUE, SET_CURRENT_TRACK, SET_PLAYED_TRACKS, ADD_PLAYED_TRACK, REMOVE_PLAYED_TRACK, SET_STATION_TRACKS_TO_PLAY, REMOVE_STATION_TRACK_TO_PLAY, SET_TRACKS_TO_PLAY, 
    ADD_TRACK_TO_PLAY, REMOVE_TRACK_TO_PLAY } from "../reducers/queue.reducer"
import { store } from "../store"
import { queueService } from "../../services/queue.service.js"


export async function setQueueToStation(station, trackNum = 0) {
    console.log('setQueueToStation', station, trackNum)
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const queue = {
            station: station,
            currentTrack: { track: station.tracks[trackNum], isStationSource: true },
            playedTracks: station.tracks.slice(0, trackNum),
            stationTracksToPlay: station.tracks.slice(trackNum+1) || [],
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

export async function playNextTrack() {
    const queue = store.getState().queueModule
    let currentTrack, playedTracks, stationTracksToPlay, tracksToPlay
    try {
        if (queue.tracksToPlay.length) 
        {
            currentTrack = { track: queue.tracksToPlay[0], isStationSource: false }
            playedTracks = queue.currentTrack.isStationSource ? [ ...queue.playedTracks, queue.currentTrack.track] : queue.playedTracks
            stationTracksToPlay = queue.stationTracksToPlay
            tracksToPlay = queue.tracksToPlay.slice(1, queue.tracksToPlay.length) || []
        } 
        else if (queue.stationTracksToPlay.length) 
        {
            currentTrack = { track: queue.stationTracksToPlay[0], isStationSource: true }
            playedTracks = queue.currentTrack.isStationSource ? [ ...queue.playedTracks, queue.currentTrack.track] : queue.playedTracks
            stationTracksToPlay = queue.stationTracksToPlay.slice(1, queue.stationTracksToPlay.length) || []
            tracksToPlay = []
        } 
        else return null

        const newQueue = {
            station: queue.station,
            currentTrack: currentTrack,
            playedTracks: playedTracks,
            stationTracksToPlay: stationTracksToPlay,
            tracksToPlay: tracksToPlay,
        }

        console.log(newQueue)
        await queueService.saveQueue(newQueue)
        store.dispatch({ type: SET_QUEUE, queue: newQueue })
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