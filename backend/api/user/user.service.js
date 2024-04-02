import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { utilService } from '../../services/util.service.js';

const COLL_NAME = 'user'

export const userService = {
    getAll,
    getById,
    remove,
    add,
    update,
    getByUsername,
    getFullById,
}

async function getAll() {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const users = await collection.find({}).toArray();
        const miniUsers = _miniUsers(users);
        console.log('miniUsers:', miniUsers)
        return miniUsers
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getFullById(userId) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const user = await collection.findOne({ _id: userId });
        if (!user) throw `Couldn't find user with _id ${userId}`;
        return user;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const user = await collection.findOne({ _id: userId });
        if (!user) throw `Couldn't find user with _id ${userId}`;
        const miniUser = _miniUsers([user])[0];
        return miniUser;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function getByUsername(fullname) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const user = await collection.findOne({ fullname: fullname });
        if (!user) return null
        const miniUser = _miniUsers([user])[0];
        return miniUser;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(COLL_NAME);
        const result = await collection.deleteOne({ _id: userId });
        if (result.deletedCount === 0) throw `Couldn't remove user with _id ${userId}`;
        return result;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function add(user) {
    try {
        user._id = utilService.makeId()

        const checkedUser = _checkUser(user)
        const collection = await dbService.getCollection(COLL_NAME);
        await collection.insertOne(checkedUser);
        const miniUser = _miniUsers([checkedUser])[0];
        return miniUser;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}


async function update(user) {
    try {
        console.log(user)
        const checkedUser = _checkUser(user)
        const collection = await dbService.getCollection(COLL_NAME);
        const result = await collection.updateOne({ _id: checkedUser._id }, { $set: checkedUser });
        if (result.modifiedCount === 0) throw `Couldn't find user with _id ${checkedUser._id}`;
        const miniUser = _miniUsers([checkedUser])[0];
        return miniUser;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

function _checkUser(user) {
    if (typeof user._id !== 'string' || 
        typeof user.fullname !== 'string' ||
        // (user.password ? typeof user.password !== 'string' : false) || 
        typeof user.imgUrl !== 'string' || 
        typeof user.likedTracks !== 'object' // ||
        // typeof user.isAdmin !== 'boolean'
        ) {
        throw new Error("User object validation failed");
    }

    // If all checks pass, construct and return the validated user object here
    let checkedUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        likedTracks: JSON.parse(JSON.stringify(user.likedTracks)),
        isAdmin: user.isAdmin
    }
    if(user.password) checkedUser.password = user.password 

    return checkedUser;
}

function _miniUsers(users) {
    // console.log(users)
    const miniUsers = users.map(user => {
        delete user.password;
        return user;
    });
    return miniUsers;
}
