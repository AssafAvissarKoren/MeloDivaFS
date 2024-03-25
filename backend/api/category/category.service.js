import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'category'
const collection = await dbService.getCollection(COLL_NAME);

export const categoryService = {
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

        let categoriesCursor = collection.find(criteria).sort(sortCriteria);

        const { categoriesPerPage } = await getSettings()

        if (filterBy.pageIdx !== undefined) {
            const startIdx = (parseInt(filterBy.pageIdx) - 1) * categoriesPerPage;
            categoriesCursor = categoriesCursor.skip(startIdx).limit(categoriesPerPage);
        }
        const categories = await categoriesCursor.toArray();

        return categories
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(categoryId) {
    try {
        const category = await collection.findOne({ _id: categoryId })
        return category
    } catch (err) {
        console.log(`ERROR: cannot find category ${categoryId}`)
        throw err
    }
}

async function remove(categoryId) {
    try {
        return await collection.deleteOne({ _id: categoryId })
    } catch (err) {
        console.log(`ERROR: cannot remove category ${categoryId}`)
        throw err
    }
}

async function update(category) {
    try {
        const checkedCategory = _checkCategory(category)
        const {updatedCount} = await collection.updateOne({ _id: checkedCategory._id }, { $set: checkedCategory })
        // if(updatedCount > 1)
        return checkedCategory
    } catch (err) {
        console.log(`ERROR: cannot update category ${category._id}`)
        throw err
    }
}

async function add(category) {
    try {
        const checkedCategory = _checkCategory(category)
        await collection.insertOne(checkedCategory)
        return checkedCategory
    } catch (err) {
        console.log(`ERROR: cannot insert category`)
        throw err
    }
}

function _checkCategory(category) {
    if (typeof category._id !== 'string' ||
        typeof category.name !== 'string' ||
        !Array.isArray(category.stationIds) || !category.stationIds.every(id => typeof id === 'string') ||
        typeof category.color !== 'string' ||
        typeof category.image !== 'string' ||
        typeof category.startingPosition !== 'number') {
        throw new Error("Category object validation failed");
    }
    
    // If all checks pass, construct and return the validated category object here
    const checkedCategory = {
        _id: category._id,
        name: category.name,
        stationIds: [...category.stationIds],
        color: category.color,
        image: category.image,
        startingPosition: category.startingPosition
    };
    return checkedCategory;
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
        return collection.find(criteria).toArray();
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
