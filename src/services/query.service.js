import { storageService } from './async-storage.service.js'

export const queryService = {
    findQuery,
    saveQuery,
}

const QUERY_STORAGE_KEY = 'queryDB'

async function findQuery(queryText) {
    const trimmedQuery = queryText.trim();
    const queries = await storageService.query(QUERY_STORAGE_KEY)
    const foundQuery = queries.find(query => query._id === trimmedQuery)
    if (foundQuery) {
        return foundQuery.tracks
    } else {
        return null
    }
}

async function saveQuery(query, tracks) {
    const trimmedQuery = query.trim();
    const queryToSave = {_id: trimmedQuery, tracks: tracks}
    const queries = await storageService.query(QUERY_STORAGE_KEY)
    queries.push(queryToSave)
    localStorage.setItem(QUERY_STORAGE_KEY, JSON.stringify(queries))
    return queryToSave
}

