import { robotService } from "../../services/robot.service";

export const SET_ROBOTS = 'SET_ROBOTS'
export const ADD_ROBOT = 'ADD_ROBOT'
export const UPDATE_ROBOT = 'UPDATE_ROBOT'
export const REMOVE_ROBOT = 'REMOVE_ROBOT'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const UNDO_CHANGES = 'UNDO_CHANGES'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    robots: null,
    filterBy: {},
    isLoading: false,
    lastRobots: []
}

export function robotReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_ROBOTS:
            return {
                ...state,
                robots: action.robots
            }
        case ADD_ROBOT:
            return {
                ...state,
                robots: [...state.robots, action.robot],
                lastRobots: [...state.robots]
            }
        case UPDATE_ROBOT:
            return {
                ...state,
                robots: state.robots.map(robot => robot.id === action.robot.id ? action.robot : robot)
            }
        case REMOVE_ROBOT:
            return {
                ...state,
                robots: state.robots.filter(robot => robot.id !== action.robotId),
                lastRobots: [...state.robots]
            }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...action.filterBy }
            }
        case 'SET_IS_LOADING':
            return {
                ...state,
                isLoading: action.isLoading
            }
        case UNDO_CHANGES:
            return {
                ...state,
                robots: [...state.lastRobots]
            }

        default:
            return state;
    }
}