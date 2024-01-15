import { robotService } from "../../services/robot.service";
import { ADD_ROBOT, REMOVE_ROBOT, SET_FILTER_BY, SET_IS_LOADING, SET_ROBOTS, UNDO_CHANGES, UPDATE_ROBOT } from "../reducers/robot.reducer";
import { store } from "../store";


export async function loadRobots() {

    const filterBy = store.getState().robotModule.filterBy
    try {
        const robots = await robotService.query(filterBy)
        store.dispatch({ type: SET_ROBOTS, robots })
    } catch (err) {
        console.log('Had issues loading robots', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }

}

export async function removeRobot(robotId) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        await robotService.remove(robotId)
        store.dispatch({ type: REMOVE_ROBOT, robotId })
    } catch (err) {
        console.log('Had issues Removing robot', err);
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeRobotOptimistic(robotId) {

    try {
        store.dispatch({ type: REMOVE_ROBOT, robotId })
        await robotService.remove(robotId)
    } catch (err) {
        store.dispatch({ type: UNDO_CHANGES })
        console.log('Had issues Removing robot', err);
        throw err
    }
}

export async function saveRobot(robotToSave) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const type = robotToSave.id ? UPDATE_ROBOT : ADD_ROBOT
    try {
        const savedRobot = await robotService.save(robotToSave)
        store.dispatch({ type, robot: savedRobot })
    } catch (err) {
        console.log('Had issues saving robot', err);
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}


export function setIsLoading(isLoading) {
    store.dispatch({ type: 'SET_IS_LOADING', isLoading })
}

