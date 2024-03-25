export const SET_CATEGORIES = "SET_CATEGORIES"
export const ADD_CATEGORY = "ADD_CATEGORY"
export const UPDATE_CATEGORY = "UPDATE_CATEGORY"
export const REMOVE_CATEGORY = "REMOVE_CATEGORY"
export const SET_IS_LOADING = "SET_IS_LOADING"

const initialState = {
    categories: null,
    isLoading: false,
}

export function categoryReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.categories
            }
        case ADD_CATEGORY:
            return {
                ...state,
                categories: [...state.categories, action.category]
            }
        case UPDATE_CATEGORY:
            return {
                ...state,
                categories: state.categories.map(category => category._id === action.category._id ? action.category : category)
            }
        case REMOVE_CATEGORY:
            return {
                ...state,
                categories: state.categories.filter(category => category._id !== action.categoryId)
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