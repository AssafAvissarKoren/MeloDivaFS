import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const BASE_DATA_STATION_COLL = 'pre_station'
const BASE_DATA_CATEGORY_COLL = 'pre_category'

export const base_dataService = {
    getStations,
    getCategories,
}

async function getCategories() {
    return await _getColl(BASE_DATA_CATEGORY_COLL);
}

async function getStations() {
    return await _getColl(BASE_DATA_STATION_COLL);
}

async function _getColl(collectionName) {
    try {
        const collection = await dbService.getCollection(collectionName);
        return await collection.find({}).toArray();
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}
