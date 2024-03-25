import { categoryService } from "../../services/category.service";
import { ADD_CATEGORY, REMOVE_CATEGORY, SET_IS_LOADING, SET_CATEGORIES, UPDATE_CATEGORY } from "../reducers/category.reducer";
import { store } from "../store";

export async function createCategories() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const categories = await categoryService.createCategories()
        store.dispatch({ type: SET_CATEGORIES, categories })
    } catch (err) {
        console.log('Had issues loading categories', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

export async function getCategory(categoryId) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const category = await categoryService.getCategory(categoryId)
        store.dispatch({ type: SET_CATEGORIES, category })
    } catch (err) {
        console.log('Had issues loading categories', err);
        throw err
    } finally {
        // store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    }
}

export async function removeCategory(categoryId) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        await categoryService.removeById(categoryId)
        store.dispatch({ type: REMOVE_CATEGORY, categoryId })
    } catch (err) {
        console.log('Had issues Removing category', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function saveCategory(categoryToSave) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const type = categoryToSave._id ? UPDATE_CATEGORY : ADD_CATEGORY
    try {
        const savedcategory = await categoryService.saveCategory(categoryToSave)
        store.dispatch({ type, category: savedcategory })
    } catch (err) {
        console.log('Had issues saving category', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export function setIsLoading(isLoading) {
    store.dispatch({ type: SET_IS_LOADING, isLoading })
}
