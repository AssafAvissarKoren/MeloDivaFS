import { imageService } from './image.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function imageColors(req, res) {
    const { imgUrl } = req.body;
    try {
        const imgColor = await imageService.extractMostCommonColor(imgUrl)
        res.send(imgColor)
    } catch (err) {
        loggerService.error('Failed to extract color', err)
        res.status(400).send({ err: 'Failed to extract color'})
    }
}
