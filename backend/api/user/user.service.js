import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { bugService } from '../bug/bug.service.js'

const COLL_NAME = 'user'
const collection = await dbService.getCollection(COLL_NAME);

export const userService = {
    query,
    getById,
    remove,
    add,
    update,
    getByUsername,
    getFullById,
}

async function query(filterBy) { //CRQ
    try {
        const users = await collection.find({}).toArray();
        const miniUsers = _miniUsers(users);
        console.log('miniUsers:', miniUsers)
        return miniUsers
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getFullById(userId) { // CRQ, since the front can't get the password, when updating the user, I need to bring the password from the DB?
    try {
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
        const user = await collection.findOne({ _id: userId });
        if (!user) throw `Couldn't find user with _id ${userId}`;
        const miniUser = _miniUsers([user])[0];
        return miniUser;
    } catch (err) {
        loggerService.error(err);
        throw err;
    }
}

async function getByUsername(username) {
    try {
        const user = await collection.findOne({ username: username });
        if (!user) throw `Couldn't find user with username ${username}`;
        const miniUser = _miniUsers([user])[0];
        return miniUser;
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(userId) {
    try {
        const userBugs = await bugService.queryByUserId()
        if (!userBugs) throw `User with _id ${userId} has bugs and can't be deleted`;
        
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
        const checkedUser = _checkUser(user)
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
        const checkedUser = _checkUser(user)
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
        typeof user.imgUrl !== 'string' || 
        typeof user.likedTracks !== 'object') {
        throw new Error("User object validation failed");
    }

    // If all checks pass, construct and return the validated user object here
    const checkedUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        likedTracks: JSON.parse(JSON.stringify(user.likedTracks))
    };

    return checkedUser;
}

function _miniUsers(users) {
    const miniUsers = users.map(user => {
        // delete user.password;
        return user;
    });
    return miniUsers;
}
