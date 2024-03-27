import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'query'

export const queryService = {
    getAll,
    getById,
    remove,
    update,
    add,
    getSettings,
    queryByUserId,
}

async function getAll() {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        return await collection.find({}).toArray();
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function getById(queryId) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const query = await collection.findOne({ _id: queryId })
        return query
    } catch (err) {
        console.log(`ERROR: cannot find query ${queryId}`)
        throw err
    }
}

async function remove(queryId) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        return await collection.deleteOne({ _id: queryId })
    } catch (err) {
        console.log(`ERROR: cannot remove query ${queryId}`)
        throw err
    }
}

async function update(query) {
    try {
        const checkedQuery = _checkQuery(query)
        const collection = await dbService.getCollection(COLL_NAME);
        const {updatedCount} = await collection.updateOne({ _id: checkedQuery._id }, { $set: checkedQuery })
        // if(updatedCount > 1)
        return checkedQuery
    } catch (err) {
        console.log(`ERROR: cannot update query ${query._id}`)
        throw err
    }
}

async function add(query) {
    try {
        const checkedQuery = _checkQuery(query)
        const collection = await dbService.getCollection(COLL_NAME);
        await collection.insertOne(checkedQuery)
        return checkedQuery
    } catch (err) {
        console.log(`ERROR: cannot insert query`)
        throw err
    }
}

function _checkQuery(query) {
    if (typeof query._id !== 'string' ||
        !Array.isArray(query.tracks) ||
        !query.tracks.every(track => typeof track.kind === 'string' &&
                                      typeof track.etag === 'string' &&
                                      typeof track.id === 'object' &&
                                      typeof track.snippet === 'object')) {
        throw new Error("Query object validation failed");
    }
    
    const checkedQuery = {
        _id: query._id,
        tracks: query.tracks.map(track => ({
            kind: track.kind,
            etag: track.etag,
            id: { ...track.id },
            snippet: { ...track.snippet }
        }))
    };
    
    return checkedQuery;
}

async function getSettings() {
    const collection = await dbService.getCollection(COLL_NAME);
    return {
        categoriesPerPage: 4,
        totalNumberOfCategories: await collection.countDocuments()
    }
}

async function queryByUserId(userId) {
    try {
        let criteria = { 'creator._id': userId }; 
        const collection = await dbService.getCollection(COLL_NAME);
        return collection.find(criteria).toArray();
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
