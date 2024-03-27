import { base_dataService } from './base_data.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getStations(req, res) {
    try {
        const stations = await base_dataService.getStations()
        res.send(stations)
    } catch (err) {
        loggerService.error('Failed to get base_data stations', err)
        res.status(400).send({ err: 'Failed to get base_data stations'})

    }
}

export async function getCategories(req, res) {
    try {
        const categories = await base_dataService.getCategories()
        res.send(categories)
    } catch (err) {
        loggerService.error('Failed to get base_data categories', err)
        res.status(400).send({ err: 'Failed to get base_data categories'})
    }
}