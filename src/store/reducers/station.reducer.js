export const SET_STATIONS = 'SET_STATIONS'
export const ADD_STATION = 'ADD_STATION'
export const UPDATE_STATION = 'UPDATE_STATION'
export const REMOVE_STATION = 'REMOVE_STATION'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_LIKED_TRACKS = 'SET_LIKED_TRACKS'
export const ADD_LIKED_TRACK = 'ADD_LIKED_TRACK'
export const REMOVE_LIKED_TRACK = 'REMOVE_LIKED_TRACK'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    stations: null,
    filterBy: {},
    likedTracks: {},
    isLoading: false,
}

export function stationReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_STATIONS:
            return {
                ...state,
                stations: action.stations
            }
        case ADD_STATION:
            return {
                ...state,
                stations: [...state.stations, action.station]
            }
        case UPDATE_STATION:
            return {
                ...state,
                stations: state.stations.map(station => station._id === action.station._id ? action.station : station)
            }
        case REMOVE_STATION:
            return {
                ...state,
                stations: state.stations.filter(station => station._id !== action.stationId)
            }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...action.filterBy }
            }
        case SET_LIKED_TRACKS:
            return {
                ...state,
                likedTracks: { ...action.likedTracks }
            }
        case ADD_LIKED_TRACK:
            return {
                ...state,
                likedTracks: { ...state.likedTracks, [action.track.url]: action.track }
            }
        case REMOVE_LIKED_TRACK:
            let tracks = {...state.likedTracks}
            delete tracks[action.track.url]
            return {
                ...state,
                likedTracks: tracks
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        default:
            return state;
    }
}