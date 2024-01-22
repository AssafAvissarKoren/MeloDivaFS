import { combineReducers, compose, legacy_createStore as createStore } from 'redux'
import { robotReducer } from './reducers/robot.reducer'
import { userReducer } from './reducers/user.reducer'
import { stationReducer } from './reducers/station.reducer'

const rootReducer = combineReducers({
    robotModule: robotReducer,
    userModule: userReducer,
    stationModule: stationReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store