export const SET_TRACKS = 'SET_TRACKS'
export const ADD_TRACK = 'ADD_TRACK'
export const UPDATE_TRACK = 'UPDATE_TRACK'
export const REMOVE_TRACK = 'REMOVE_TRACK'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    tracks: null,
    filterBy: {},
    isLoading: false,
}

export function trackReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_TRACKS:
            return {
                ...state,
                tracks: action.tracks
            }
        case ADD_TRACK:
            return {
                ...state,
                tracks: [...state.tracks, action.track]
            }
        case UPDATE_TRACK:
            return {
                ...state,
                tracks: state.tracks.map(track => track._id === action.track._id ? action.track : track)
            }
        case REMOVE_TRACK:
            return {
                ...state,
                tracks: state.tracks.filter(track => track._id !== action.trackId)
            }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...action.filterBy }
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