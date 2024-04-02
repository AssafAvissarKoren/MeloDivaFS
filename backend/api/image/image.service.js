import { loggerService } from '../../services/logger.service.js'
import Vibrant from 'node-vibrant';

export const imageService = {
    extractMostCommonColor,
}

async function extractMostCommonColor(imagePath) {
    try {
        const image = await Vibrant.from(imagePath).getPalette(); // Extract color palette from the image
        const dominantColor = image.Vibrant.getRgb(); // Get the RGB value of the dominant color
        console.log("flag3")
        const hexColor = _rgbToHex(dominantColor); // Convert RGB to hexadecimal color code
        console.log("flag4")
        return hexColor; // Return the hexadecimal color code
    } catch (error) {
        loggerService.error(err);
        throw err;
    }
}

function _rgbToHex(rgb) {
    return '#' + rgb.map(c => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}
