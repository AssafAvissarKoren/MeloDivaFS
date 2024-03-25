import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'msg'
const collection = await dbService.getCollection(COLL_NAME);

export const msgService = {
    query,
    getById,
    remove,
    add,
    update,
}

async function query() {
    try {
        const messages = await _aggregateMsgs({})
        if (!messages) throw `No msgs found in the collection ${COLL_NAME}`;
        return messages;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(msgId) {
    try {
        const message = await _aggregateMsg(msgId)
        if (!message) throw `Couldn't find msg with _id ${msgId}`;
        return message;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(msgId) {
    try {
        const result = await collection.deleteOne({ _id: msgId });
        if (result.deletedCount === 0) throw `Couldn't remove msg with _id ${msgId}`;
        return result;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function add(msg) {
    try {
        const checkedMsg = _checkMsg(msg)
        await collection.insertOne(checkedMsg);
        return checkedMsg;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function update(msg) {
    try {
        const checkedMsg = _checkMsg(msg)
        const result = await collection.updateOne({ _id: checkedMsg._id }, { $set: checkedMsg });
        if (result.modifiedCount === 0) throw `Couldn't find msg with _id ${checkedMsg._id}`;
        return checkedMsg;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

function _checkMsg(msg) {
    if (typeof msg._id !== 'string' || 
        typeof msg.txt !== 'string' || 
        typeof msg.aboutBugId !== 'string' || 
        typeof msg.byUserId !== 'string') {
        throw new Error("Msg object validation failed");
    }

    // If all checks pass, construct and return the validated msg object here
    const checkedMsg = {
        _id: msg._id,
        txt: msg.txt,
        aboutBugId: msg.aboutBugId,
        byUserId: msg.byUserId
    };

    return checkedMsg;
}

async function _aggregateMsgs(match) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const message = await collection.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'bug',
                    localField: 'aboutBugId',
                    foreignField: '_id',
                    as: 'aboutBug'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'byUserId',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$aboutBug'
            },
            {
                $unwind: '$byUser'
            },
            {
                $project: {
                    _id: true,
                    txt: true,
                    aboutBug: {
                        _id: '$aboutBug._id',
                        title: '$aboutBug.title',
                        severity: '$aboutBug.severity'
                    },
                    byUser: {
                        _id: '$byUser._id',
                        fullname: '$byUser.fullname'
                    }
                }
            }
        ]).toArray();

        if (!message || message.length === 0) {
            throw new Error(`Message with ID ${msgId} not found`);
        }

        return message;
    } catch (err) {
        console.error(`Error fetching message with ID ${msgId}:`, err);
        throw err;
    }
}

async function _aggregateMsg(msgId) {
    try {
        const msg = await collection.findOne({ _id: msgId });
        const bugCollection = await dbService.getCollection('bug')
        const aboutBug =  await bugCollection.findOne({ _id: msg.aboutBugId });
        const userCollection = await dbService.getCollection('user')
        const byUser = await userCollection.findOne({ _id: msg.byUserId });

        const fullMsg = {
            _id: msg._id,
            txt: msg.txt,
            aboutBug: {
                _id: aboutBug._id,
                title: aboutBug.title,
                severity: aboutBug.severity
            },
            byUser: {
                _id: byUser._id,
                fullname: byUser.fullname
            }
        };

        return fullMsg;
    } catch (err) {
        console.error(`Error fetching message with ID ${msgId}:`, err);
        throw err;
    }
}
