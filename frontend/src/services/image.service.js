import { utilService } from './util.service.js';
import { FastAverageColor } from 'fast-average-color';
import ColorThief from 'colorthief';
import { httpService } from './http.service.js';
const IMAGE_STORAGE_KEY = 'imageDB';

export const imageService = {
    analyzeCommonColor,
    // analyzeImage,
    // analyzeImage2,
    // downloadImage,
};

async function analyzeCommonColor(imgUrl) {
    console.log("analyzeCommonColor", imgUrl)
    return await httpService.post(`image`, {imgUrl});
}


// async function downloadImage(imageURL, filename) {
//     try {
//         // Create an anchor element
//         const anchor = document.createElement('a');
//         anchor.style.display = 'none';

//         // Set the href attribute to the image URL
//         anchor.href = imageURL;

//         // Set the download attribute to force download
//         anchor.download = filename;

//         // Append the anchor to the document body
//         document.body.appendChild(anchor);

//         // Programmatically click on the anchor to initiate the download
//         anchor.click();

//         // Remove the anchor from the document body
//         document.body.removeChild(anchor);
//     } catch (error) {
//         console.error('Error downloading image:', error);
//         throw error;
//     }
// }



// async function analyzeImage2(imageURL) {
//     try {
//         // Create an image element
//         const img = document.createElement('img');

//         // Set the image source
//         img.src = imageURL;

//         // When the image is loaded
//         img.onload = () => {
//             // Create a canvas element
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');

//             // Set canvas dimensions to match the image
//             canvas.width = img.naturalWidth;
//             canvas.height = img.naturalHeight;

//             // Draw the image onto the canvas
//             ctx.drawImage(img, 0, 0);

//             // Get the image data from the canvas
//             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//             const fac = new FastAverageColor();
//             const dominantColor = fac.getColor(imageData);

//             // Resolve the promise with the dominant color
//             return resolve(dominantColor);
//         };

//         // Append the image to the document to trigger the image loading process
//         document.body.appendChild(img);

//     } catch (error) {
//         console.error('Error analyzing image:', error);
//         throw error;
//     }
// }


// async function analyzeImage(imageURL) {
//     try {
//         // Create an image element
//         const img = new Image();
//         console.log('flag1');

//         return new Promise((resolve, reject) => {
//             img.crossOrigin = 'Anonymous'; // Set cross-origin attribute to anonymous
//             console.log('flag1.2');
//             img.onload = () => {
//                 try {
//                     console.log('flag2');

//                     // Create a canvas element
//                     const canvas = document.createElement('canvas');
//                     const ctx = canvas.getContext('2d');
//                     console.log('flag3');

//                     // Set the canvas dimensions to match the image
//                     canvas.width = img.width;
//                     canvas.height = img.height;
//                     console.log('flag4');

//                     // Draw the image onto the canvas
//                     ctx.drawImage(img, 0, 0);
//                     console.log('flag5');

//                     // Get the image data from the canvas
//                     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//                     console.log('flag6');

//                     // Create a ColorThief instance
//                     const colorThief = new ColorThief();
//                     console.log('flag7');

//                     // Use ColorThief to get the dominant color
//                     const dominantColor = colorThief.getColor(imageData);
//                     console.log('flag8');

//                     // Resolve the promise with the dominant color
//                     resolve(dominantColor);
//                 } catch (error) {
//                     reject(error);
//                 }
//             };

//             img.onerror = (error) => {
//                 reject(error);
//             };

//             // Set the image source to trigger the loading process
//             img.src = imageURL;
//         });
//     } catch (error) {
//         console.error('Error analyzing image:', error);
//         throw error;
//     }
// }

// function saveImage(imageUrl, serverUrl = 'http://localhost:5173') {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // Send a request to the server's proxy endpoint
//             const response = await fetch(`${serverUrl}/proxy?url=${imageUrl}`);
//             if (response.ok) {
//                 const dataURL = await response.text();
//                 utilService.sessionStorage.setItem(IMAGE_STORAGE_KEY, dataURL);
//                 resolve(dataURL);
//             } else {
//                 reject(new Error(`Failed to fetch image from server: ${response.statusText}`));
//             }
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// function loadImage() {
//     const dataURL = utilService.sessionStorage.getItem(IMAGE_STORAGE_KEY);
//     return dataURL || null;
// }


