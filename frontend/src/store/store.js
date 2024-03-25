import { combineReducers, compose, legacy_createStore as createStore, applyMiddleware } from 'redux';
// import { combineReducers, compose, legacy_createStore as createStore } from 'redux'
import { thunk } from 'redux-thunk';
import { stationReducer } from './reducers/station.reducer'
import { categoryReducer } from './reducers/category.reducer'
import { queueReducer } from './reducers/queue.reducer'
import { userReducer } from './reducers/user.reducer'
import { playerReducer } from './reducers/player.reducer'

const rootReducer = combineReducers({
    stationModule: stationReducer,
    categoryModule: categoryReducer,
    queueModule: queueReducer,
    userModule: userReducer,
    playerModule: playerReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
// export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store