// import express, { json } from 'express';
// import fetch from 'node-fetch';

// const app = express();
// const port = process.env.PORT || 3001; // Set your desired port

// app.use(json());

// // Create a route to handle proxy requests
// app.get('/proxy', async (req, res) => {
//     const imageUrl = req.query.url;
//     if (!imageUrl) {
//         return res.status(400).send('Missing image URL');
//     }

//     try {
//         const response = await fetch(imageUrl);
//         if (response.ok) {
//             const imageBuffer = await response.buffer();
//             res.contentType('image/jpeg'); // Set the appropriate content type
//             res.send(imageBuffer);
//         } else {
//             res.status(response.status).send(response.statusText);
//         }
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Proxy server is running on port ${port}`);
// });

import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors'
import Vibrant from 'node-vibrant'; // Import node-vibrant library

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

const app = express();
const BASE_PATH = 'F:\\Daily\\Skills\\Programming\\Coding-Academy\\Final Project\\ender-proj\\src\\assets\\imgs\\stationImg\\';
const JSON_PATH = 'F:\\Daily\\Skills\\Programming\\Coding-Academy\\Final Project\\ender-proj\\src\\assets\\JSON\\allStations.json'

http://localhost:5173/

// Express middleware and other setup...

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions))

function rgbToHex(rgb) {
    return '#' + rgb.map(c => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// Function to extract the most common color from an image
async function extractMostCommonColor(imagePath) {
    try {
        const image = await Vibrant.from(imagePath).getPalette(); // Extract color palette from the image
        const dominantColor = image.Vibrant.getRgb(); // Get the RGB value of the dominant color
        const hexColor = rgbToHex(dominantColor); // Convert RGB to hexadecimal color code
        return hexColor; // Return the hexadecimal color code
    } catch (error) {
        console.error("Error extracting image color:", error);
        throw error;
    }
}

app.post('/api/getImageColors', async (req, res) => {
    try {
        const { imagePaths } = req.body;
        const colorPromises = imagePaths.map(async (path) => {
            const color = await extractMostCommonColor(BASE_PATH + path + '.jpg'); // Extract color from image
            return [path, color]; // Returns an array containing the path and its most common color
        });
        const colors = await Promise.all(colorPromises);
        res.json(colors);
    } catch (error) {
        console.error("Error fetching image colors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/getImageColor', async (req, res) => {
    try {
        const { imagePath } = req.body;
        const color = await extractMostCommonColor(imagePath); // Extract color from image
        res.json(color);
    } catch (error) {
        console.error("Error fetching image colors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/api/updateStations', async (req, res) => {
    try {
        const { updatedStations } = req.body;
        const json = JSON.stringify(updatedStations, null, 2);
        await fs.writeFile(JSON_PATH, json);
        res.status(200).json({ message: 'Stations updated successfully' });
    } catch (error) {
        console.error("Error updating stations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Other routes and server setup...

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

