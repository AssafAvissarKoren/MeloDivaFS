import { combineReducers, compose, legacy_createStore as createStore } from 'redux'
import { stationReducer } from './reducers/station.reducer'
import { categoryReducer } from './reducers/category.reducer'
import { queueReducer } from './reducers/queue.reducer'
import { userReducer } from './reducers/user.reducer'

const rootReducer = combineReducers({
    stationModule: stationReducer,
    categoryModule: categoryReducer,
    queueModule: queueReducer,
    userModule: userReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store