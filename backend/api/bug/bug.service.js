import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'bug'
const collection = await dbService.getCollection(COLL_NAME);

export const bugService = {
    query,
    getById,
    remove,
    update,
    add,
    getSettings,
    queryByUserId,
}


async function query(filterBy = {}) {
    try {
        let criteria = {};
        if (filterBy.text) {
            const regExp = new RegExp(filterBy.text, 'i')
            criteria.$or = [
                { title: { $regex: regExp } },
                { description: { $regex: regExp } }
            ];
        } 
        if (filterBy.minSeverity) {
            criteria.severity = { $gte: filterBy.minSeverity };
        }
        if (filterBy.labels && filterBy.labels.length > 0) {
            criteria.labels = { $in: filterBy.labels };
        }
        if (filterBy.createdBy) {
            criteria['creator._id'] = filterBy.createdBy;
        }

        let sortCriteria = {};
        if (filterBy.sortCriterion === 'date') {
            sortCriteria = { createdAt: 1 };
        } else if (filterBy.sortCriterion === 'title') {
            sortCriteria = { title: 1 };
        }

        let bugsCursor = collection.find(criteria).sort(sortCriteria);

        const { bugsPerPage } = await getSettings()

        if (filterBy.pageIdx !== undefined) {
            const startIdx = (parseInt(filterBy.pageIdx) - 1) * bugsPerPage;
            bugsCursor = bugsCursor.skip(startIdx).limit(bugsPerPage);
        }
        const bugs = await bugsCursor.toArray();

        return bugs
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = await collection.findOne({ _id: bugId })
        return bug
    } catch (err) {
        console.log(`ERROR: cannot find bug ${bugId}`)
        throw err
    }
}

async function remove(bugId) {
    try {
        return await collection.deleteOne({ _id: bugId })
    } catch (err) {
        console.log(`ERROR: cannot remove bug ${bugId}`)
        throw err
    }
}

async function update(bug) {
    try {
        const checkedBug = _checkBug(bug)
        const {updatedCount} = await collection.updateOne({ _id: checkedBug._id }, { $set: checkedBug })
        // if(updatedCount > 1)
        return checkedBug
    } catch (err) {
        console.log(`ERROR: cannot update bug ${bug._id}`)
        throw err
    }
}

async function add(bug) {
    try {
        const checkedBug = _checkBug(bug)
        await collection.insertOne(checkedBug)
        return checkedBug
    } catch (err) {
        console.log(`ERROR: cannot insert bug`)
        throw err
    }
}

function _checkBug(bug) {
    if (typeof bug._id !== 'string' ||
        typeof bug.title !== 'string' ||
        typeof bug.description !== 'string' ||
        typeof bug.severity !== 'string' ||
        typeof bug.createdAt !== 'number' ||
        !Array.isArray(bug.labels) || !bug.labels.every(label => typeof label === 'string') ||
        typeof bug.creator !== 'object' || 
        typeof bug.creator._id !== 'string' || 
        typeof bug.creator.fullname !== 'string') {
        throw new Error("Bug object validation failed");
    }
    
    // If all checks pass, construct and return the validated bug object here
    const checkedBug = {
        _id: bug._id,
        title: bug.title,
        description: bug.description,
        severity: bug.severity,
        createdAt: bug.createdAt,
        labels: bug.labels,
        creator: {
            _id: bug.creator._id,
            fullname: bug.creator.fullname,
        }
    };
    return checkedBug;
}

async function getSettings() {
    const collection = await dbService.getCollection(COLL_NAME);    
    return {
        bugsPerPage: 4,
        totalNumberOfBugs: await collection.countDocuments()
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
