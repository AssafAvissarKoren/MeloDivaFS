import { combineReducers, compose, legacy_createStore as createStore } from 'redux'
import { stationReducer } from './reducers/station.reducer'
import { categoryReducer } from './reducers/category.reducer'
import { trackReducer } from './reducers/track.reducer'

const rootReducer = combineReducers({
    stationModule: stationReducer,
    categoryModule: categoryReducer,
    trackModule: trackReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store