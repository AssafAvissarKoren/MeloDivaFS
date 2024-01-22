export const SET_STATIONS = 'SET_STATIONS'
export const ADD_STATION = 'ADD_STATION'
export const UPDATE_STATION = 'UPDATE_STATION'
export const REMOVE_STATION = 'REMOVE_STATION'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    stations: null,
    filterBy: {},
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
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }

        default:
            return state;
    }
}