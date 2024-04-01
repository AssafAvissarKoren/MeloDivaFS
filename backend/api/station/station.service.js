import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { utilService } from '../../services/util.service.js';

const COLL_NAME = 'station'
const collection = await dbService.getCollection(COLL_NAME);

export const stationService = {
    query,
    getById,
    remove,
    update,
    add,
    getSettings,
    queryByUserId,
}


async function query() {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        return await collection.find({}).toArray();
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function getById(stationId) {
    try {
        const station = await collection.findOne({ _id: stationId })
        return station
    } catch (err) {
        console.log(`ERROR: cannot find station ${stationId}`)
        throw err
    }
}

async function remove(stationId) {
    try {
        await collection.deleteOne({ _id: stationId })
    } catch (err) {
        console.log(`ERROR: cannot remove station ${stationId}`)
        throw err
    }
}

async function update(station) {
    try {
        const checkedStation = _checkStation(station)
        const {updatedCount} = await collection.updateOne({ _id: checkedStation._id }, { $set: checkedStation })
        // if(updatedCount > 1)
        return checkedStation
    } catch (err) {
        console.log(`ERROR: cannot update station ${station._id}`)
        throw err
    }
}

async function add(station) {
    try {
        station._id = utilService.makeId()
        station.mostCommonColor = "#333333"

        const checkedStation = _checkStation(station)
        await collection.insertOne(checkedStation)
        return checkedStation
    } catch (err) {
        console.log(`ERROR: cannot insert station`)
        throw err
    }
}

function _checkStation(station) {
    console.log(station)
    if (typeof station._id !== 'string' ||
        typeof station.name !== 'string' ||
        typeof station.description !== 'string' ||
        // typeof station.artist !== 'string' ||
        typeof station.imgUrl !== 'string' ||
        !Array.isArray(station.tags) || !station.tags.every(tag => typeof tag === 'string') ||
        typeof station.createdBy !== 'object' || 
        typeof station.createdBy._id !== 'string' || 
        typeof station.createdBy.fullname !== 'string' ||
        typeof station.createdBy.imgUrl !== 'string' ||
        !Array.isArray(station.likedByUsers) || !station.likedByUsers.every(user => typeof user === 'object' && typeof user._id === 'string' && typeof user.fullname === 'string' && typeof user.imgUrl === 'string') ||
        !Array.isArray(station.tracks) || !station.tracks.every(track => typeof track === 'object' && typeof track.title === 'string' && typeof track.artist === 'string' && typeof track.url === 'string' && typeof track.imgUrl === 'string' && typeof track.duration === 'string' && typeof track.addedBy === 'object' && typeof track.addedBy._id === 'string' && typeof track.addedBy.fullname === 'string' && typeof track.addedBy.imgUrl === 'string') ||
        typeof station.mostCommonColor !== 'string' ||
        !Array.isArray(station.msgs) || !station.msgs.every(msg => typeof msg === 'object' && typeof msg.id === 'string' && typeof msg.from === 'object' && typeof msg.from._id === 'string' && typeof msg.from.fullname === 'string' && typeof msg.from.imgUrl === 'string' && typeof msg.txt === 'string') ||
        typeof station.isPublic !== 'boolean'
    ) {
        throw new Error("Station object validation failed");
    }
    
    // If all checks pass, construct and return the validated station object here
    const checkedStation = {
        _id: station._id,
        name: station.name,
        description: station.description,
        artist: station.artist,
        imgUrl: station.imgUrl,
        tags: station.tags,
        createdBy: {
            _id: station.createdBy._id,
            fullname: station.createdBy.fullname,
            imgUrl: station.createdBy.imgUrl
        },
        likedByUsers: [...station.likedByUsers],
        tracks: [...station.tracks],
        mostCommonColor: station.mostCommonColor,
        msgs: [...station.msgs],
        isPublic: station.isPublic
    };
    return checkedStation;
}

async function getSettings() {
    const collection = await dbService.getCollection(COLL_NAME);    
    return {
        stationsPerPage: 4,
        totalNumberOfStations: await collection.countDocuments()
    }
}

async function queryByUserId(userId) {
    try {
        let criteria = { 'creator._id': userId }; 
        return collection.find(criteria).toArray();
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
