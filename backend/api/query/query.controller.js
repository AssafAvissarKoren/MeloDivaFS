import { queryService } from './query.service.js'
import { loggerService } from '../../services/logger.service.js'

// Create
export async function addQuery(req, res) {
    const query = req.body
    try {
        const savedQuery = await queryService.add(query)
        res.send(savedQuery)
    } catch (err) {
        loggerService.error('Failed to save query', err)
        res.status(400).send({ err: 'Failed to save query'})
    }
}

// Read
export async function getQueries(req, res) {
    try {
        const queries = await queryService.getAll()
        res.send(queries)
    } catch (err) {
        loggerService.error('Failed to get queries', err)
        res.status(400).send({ err: 'Failed to get queries'})
    }
}

export async function getQuery(req, res) {
    const { queryId } = req.params
    try {
        const query = await queryService.getById(queryId)
        res.send(query)
    } catch (err) {
        loggerService.error('Failed to get query', err)
        res.status(400).send({ err: 'Failed to get query'})
    }
}

// Update
export async function updateQuery(req, res) {
    const queryToUpdate = req.body
    try {
        const savedQuery = await queryService.update(queryToUpdate)
        res.send(savedQuery)
    } catch (err) {
        loggerService.error('Failed to update query', err)
        res.status(400).send({ err: 'Failed to update query'})
    }
}

// Delete
export async function removeQuery(req, res) {
    const { queryId } = req.params
    try {
        await queryService.remove(queryId)
        res.send('Deleted OK')
    } catch (err) {
        loggerService.error('Failed to remove query', err)
        res.status(400).send({ err: 'Failed to remove query'})
    }
}

