import { preService } from './pre.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getStations(req, res) {
    try {
        const stations = await preService.getStations()
        res.send(stations)
    } catch (err) {
        loggerService.error('Failed to get pre stations', err)
        res.status(400).send({ err: 'Failed to get pre stations'})

    }
}

export async function getCategories(req, res) {
    try {
        const categories = await preService.getCategories()
        res.send(categories)
    } catch (err) {
        loggerService.error('Failed to get pre categories', err)
        res.status(400).send({ err: 'Failed to get pre categories'})
    }
}