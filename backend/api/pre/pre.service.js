import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const PRE_STATION_NAME = 'pre_station'
const PRE_CATEGORY_NAME = 'pre_category'

export const preService = {
    getStations,
    getCategories,
}

async function getCategories() {
    return await _getColl(PRE_CATEGORY_NAME);
}

async function getStations() {
    return await _getColl(PRE_STATION_NAME);
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
