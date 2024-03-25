import fs from 'fs'
import { loggerService } from './logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const JSON_Path = './data/bug.json'

var bugs = _readJsonFile(JSON_Path)

async function query() {
    try {
        return bugs 
    } catch(err) {
        loggerService.error(`Had problems getting bugs...`)
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        return bug
    } catch (err) {
        loggerService.error(`Had problems getting bug ${bugId}...`)
        throw err
    }
}

async function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    try {
        _saveBugsToFile(JSON_Path)
    } catch (err) {
        loggerService.error(`Had problems removing bug ${bugId}...`)
        throw err
    }

    return `Bug ${bugId} removed`
}

async function save(bugToSave) {
    try {
        if(bugToSave._id){
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if(idx === -1) throw 'Bad Id'
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = _makeId()
            bugs.push(bugToSave)
        }
        _saveBugsToFile(JSON_Path)
    } catch (err) {
        loggerService.error(`Had problems saving bug ${bugToSave._id}...`)
        throw err
    }
    return bugToSave
}

function _makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function _readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function _saveBugsToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}