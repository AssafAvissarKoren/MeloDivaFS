export const SET_QUEUE = "SET_QUEUE"
export const SET_CURRENT_TRACK = "SET_CURRENT_TRACK"

export const SET_PLAYED_TRACKS = "SET_PLAYED_TRACKS"
export const ADD_PLAYED_TRACK = "ADD_PLAYED_TRACK"
export const REMOVE_PLAYED_TRACK = "REMOVE_PLAYED_TRACK"

export const SET_STATION_TRACKS_TO_PLAY = "SET_STATION_TRACKS_TO_PLAY"
export const REMOVE_STATION_TRACK_TO_PLAY = "REMOVE_STATION_TRACK_TO_PLAY"

export const SET_TRACKS_TO_PLAY = "SET_TRACKS_TO_PLAY"
export const ADD_TRACK_TO_PLAY = "ADD_TRACK_TO_PLAY"
export const REMOVE_TRACK_TO_PLAY = "REMOVE_TRACK_TO_PLAY"


const initialState = {
    station: null,
    currentTrack: {}, // {track: track, isStationSource: (true / false)}
    playedTracks: [],
    stationTracksToPlay: [],
    tracksToPlay: [],
}

export function queueReducer(state = initialState, action = {}) {
    switch (action.type) {  
        case SET_QUEUE:
            return {
                ...state, ...action.queue
            }
        case SET_CURRENT_TRACK:
            return {
                ...state,
                currentTrack: action.currentTrack
            }

        case SET_PLAYED_TRACKS:
            return {
                ...state,
                playedTracks: action.tracks
            }
        case ADD_PLAYED_TRACK:
            return {
                ...state,
                playedTracks: [...state.playedTracks, action.track]
            }
        case REMOVE_PLAYED_TRACK:
            return {
                ...state,
                playedTracks: state.playedTracks.filter(playedTrack => playedTrack.url !== action.track.url)
            }

        case SET_STATION_TRACKS_TO_PLAY:
            return {
                ...state,
                stationTracksToPlay: action.tracks
            }
        case REMOVE_STATION_TRACK_TO_PLAY:
            return {
                ...state,
                stationTracksToPlay: state.stationTracksToPlay.filter(trackToPlay => trackToPlay.url !== action.track.url)
            }
        
        case SET_TRACKS_TO_PLAY:
            return {
                ...state,
                queue: action.tracks
            }
        case ADD_TRACK_TO_PLAY:
            return {
                ...state,
                tracksToPlay: [...state.tracksToPlay, action.track]
            }
        case REMOVE_TRACK_TO_PLAY:
            return {
                ...state,
                tracksToPlay: state.tracksToPlay.filter(track => track.url !== action.track.url)
            }

        default:
            return state;
    }
}