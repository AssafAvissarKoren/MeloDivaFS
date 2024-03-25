import { SET_QUEUE, ADD_TRACK_TO_PLAY, SET_CURRENT_TRACK, SET_PLAYED_TRACKS, ADD_PLAYED_TRACK, REMOVE_PLAYED_TRACK, 
    SET_STATION_TRACKS_TO_PLAY, REMOVE_STATION_TRACK_TO_PLAY, SET_TRACKS_TO_PLAY, REMOVE_TRACK_TO_PLAY } from "../reducers/queue.reducer"
import { store } from "../store"
import { queueService } from "../../services/queue.service.js"
import { getPlayState } from "./player.actions.js"

export async function setQueueToStation(station, trackNum = -1) {
    console.log('setQueueToStation', trackNum, station)
    try {
        if(trackNum === -1) {
            trackNum = getPlayState().isShuffle ? Math.floor(Math.random() * (station.tracks.length-1)) : 0
        }

        const queue = {
            station: station,
            currentTrack: { track: station.tracks[trackNum], isStationSource: true },
            playedTracks: station.tracks.slice(0, trackNum) || [],
            stationTracksToPlay: station.tracks.slice(trackNum+1) || [],
            tracksToPlay: [],
            trackNum: trackNum,
        }
        queueService.saveQueue(queue)
        store.dispatch({ type: SET_QUEUE, queue })
        return store.getState().queueModule.currentTrack
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
        queueService.saveQueue(queue)
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
        queueService.saveQueue({...queue, tracksToPlay: [...queue.tracksToPlay, track]})
        store.dispatch({ type: ADD_TRACK_TO_PLAY, track })
        return getCurrentTrackInQueue()
    } catch (err) {
        console.log('Had issues Setting the queue', err);
        throw err
    }
}

export async function playNextTrack() {
    const isShuffle = store.getState().playerModule.isShuffle;
    const isLooping = store.getState().playerModule.isLooping;
    console.log('playNextTrack', isShuffle ? 'shuffle' : '', isLooping ? 'loop' : '')
    if(isLooping) {
        await _playAdjacentTrack(0, false)
    } else {
        await _playAdjacentTrack(1, isShuffle)
    }
}

export async function playPrevTrack() {
    const isShuffle = store.getState().playerModule.isShuffle;
    const isLooping = store.getState().playerModule.isLooping;
    console.log('playPrevTrack', isShuffle ? 'shuffle' : '', isLooping ? 'loop' : '')
    if(isLooping) {
        await _playAdjacentTrack(0, false)
    } else {
        await _playAdjacentTrack(-1, isShuffle)
    }

}

export async function _playAdjacentTrack(num, random) {
    try {  
        const station = store.getState().queueModule.station
        const stationLength = station.tracks.length
        const currNum = random ? Math.floor(Math.random() * stationLength) : num ;
        const currTrackNum = store.getState().queueModule.trackNum
        const newTrackNum = (currTrackNum + currNum) % stationLength;
        console.log('_playAdjacentTrack', "num", num, "random", random, "currNum", currNum, "newTrackNum", newTrackNum, "currTrackNum", currTrackNum, "stationLength", stationLength)

        setQueueToStation(station, newTrackNum)
    } catch (err) {
        console.log('Had issues getting the prev track index', err);
        throw err
    }
}

// export async function nextTrackInQueue() {
//     const stationTracksToPlay = store.getState().queueModule.stationTracksToPlay
//     const tracksToPlay = store.getState().queueModule.tracksToPlay
//     let track
//     try {
//         if(tracksToPlay.length) {
//             track = tracksToPlay[0]
//             store.dispatch({ type: REMOVE_TRACK_TO_PLAY, track })
//         } else {
//             track = stationTracksToPlay[0]
//             console.log('nextTrackInQueue', track)
//             store.dispatch({ type: REMOVE_STATION_TRACK_TO_PLAY, track })
//             store.dispatch({ type: ADD_PLAYED_TRACK, track })
//         }
//         return getCurrentTrackInQueue()
//     } catch (err) {
//         console.log('Had issues Setting the queue', err);
//         throw err
//     }
// }

// export async function playPrevTrack() {
//     const queue = store.getState().queueModule
//     try {
//         if (!queue.playedTracks.length) return null

//         const newQueue = {
//             station: queue.station,
//             currentTrack: { track: queue.playedTracks[queue.playedTracks.length-1], isStationSource: true },
//             playedTracks: queue.playedTracks.slice(0, queue.playedTracks.length-2) || [],
//             stationTracksToPlay: queue.currentTrack.isStationSource ? [queue.currentTrack.track, ...queue.stationTracksToPlay] : queue.stationTracksToPlay,
//             tracksToPlay: queue.tracksToPlay,
//         }

//         await queueService.saveQueue(newQueue)
//         store.dispatch({ type: SET_QUEUE, queue: newQueue })
//         return getCurrentTrackInQueue()
//     } catch (err) {
//         console.log('Had issues Setting the queue', err);
//         throw err
//     }
// }

export function getCurrentTrackInQueue() {
    const currentTrack = store.getState().queueModule?.currentTrack.track
    return currentTrack
}

export function getQueuedStaion() {
    const queuedStation = store.getState().queueModule.station
    const currentTrack = store.getState().queueModule.currentTrack
    return currentTrack.isStationSource ? queuedStation : null
}