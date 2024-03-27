import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

const COLL_NAME = 'category'

export const categoryService = {
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

async function getById(categoryId) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const category = await collection.findOne({ _id: categoryId })
        return category
    } catch (err) {
        console.log(`ERROR: cannot find category ${categoryId}`)
        throw err
    }
}

async function remove(categoryId) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        return await collection.deleteOne({ _id: categoryId })
    } catch (err) {
        console.log(`ERROR: cannot remove category ${categoryId}`)
        throw err
    }
}

async function update(category) {
    try {
        const checkedCategory = _checkCategory(category)
        const collection = await dbService.getCollection(COLL_NAME);
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
        const collection = await dbService.getCollection(COLL_NAME);
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
        const collection = await dbService.getCollection(COLL_NAME);
        return collection.find(criteria).toArray();
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
