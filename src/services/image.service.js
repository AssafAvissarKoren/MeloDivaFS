import { utilService } from './util.service.js';

const IMAGE_STORAGE_KEY = 'imageDB';

export const imageService = {
    saveImage,
    loadImage,
};

function saveImage(imageUrl, serverUrl = 'http://localhost:5173') {
    return new Promise(async (resolve, reject) => {
        try {
            // Send a request to the server's proxy endpoint
            const response = await fetch(`${serverUrl}/proxy?url=${imageUrl}`);
            if (response.ok) {
                const dataURL = await response.text();
                utilService.sessionStorage.setItem(IMAGE_STORAGE_KEY, dataURL);
                resolve(dataURL);
            } else {
                reject(new Error(`Failed to fetch image from server: ${response.statusText}`));
            }
        } catch (error) {
            reject(error);
        }
    });
}

function loadImage() {
    const dataURL = utilService.sessionStorage.getItem(IMAGE_STORAGE_KEY);
    return dataURL || null;
}
