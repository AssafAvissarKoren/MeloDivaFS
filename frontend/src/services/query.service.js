import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js';

export const queryService = {
    findQuery,
    saveQuery,
}

const QUERY_STORAGE_KEY = 'queryDB'

async function findQuery(queryText) {
    const trimmedQuery = queryText.trim();
    // const queries = await storageService.query(QUERY_STORAGE_KEY)
    // const foundQuery = queries.find(query => query._id === trimmedQuery)
    const foundQuery = await httpService.get(`query/${trimmedQuery}`)
    if (foundQuery) {
        return foundQuery
    } else {
        return null
    }
}

async function saveQuery(query, tracks) {
    const trimmedQuery = query.trim();
    const queryToSave = {_id: trimmedQuery, tracks: tracks}
    // const queries = await storageService.query(QUERY_STORAGE_KEY)
    // queries.push(queryToSave)
    // localStorage.setItem(QUERY_STORAGE_KEY, JSON.stringify(queries))
    // return queryToSave
    return await httpService.post(`query`, queryToSave)
}

