import { msgService } from './msg.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export async function getMsg(req, res) {
    try {
        const msg = await msgService.getById(req.params.msgId)
        res.send(msg)
    } catch (err) {
        loggerService.error('Failed to get msg', err)
        res.status(400).send({ err: 'Failed to get msg' })
    }
}

export async function getMsgs(req, res) {
    try {
        const msgs = await msgService.query()
        res.send(msgs)
    } catch (err) {
        loggerService.error('Failed to get msgs', err)
        res.status(400).send({ err: 'Failed to get msgs' })
    }
}

export async function deleteMsg(req, res) {
    try {
        await msgService.remove(req.params.msgId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        loggerService.error('Failed to delete msg', err)
        res.status(400).send({ err: 'Failed to delete msg' })
    }
}

export async function addMsg(req, res) {
    try {
        const msg = req.body
        const fullMsg = { ...msg, 
            _id: utilService.makeId() 
        }
        const savedMsg = await msgService.add(fullMsg)
        res.send(savedMsg)
    } catch (err) {
        loggerService.error('Failed to create msg', err)
        res.status(400).send({ err: 'Failed to create msg' })
    }
}

export async function updateMsg(req, res) {
    const msgToUpdate = req.body
    try {
        const savedMsg = await msgService.update(msgToUpdate)
        res.send(savedMsg)
    } catch (err) {
        res.status(400).send(`Couldn't update msg`)
    }
}


