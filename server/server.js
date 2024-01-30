import express, { json } from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3001; // Set your desired port

app.use(json());

// Create a route to handle proxy requests
app.get('/proxy', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).send('Missing image URL');
    }

    try {
        const response = await fetch(imageUrl);
        if (response.ok) {
            const imageBuffer = await response.buffer();
            res.contentType('image/jpeg'); // Set the appropriate content type
            res.send(imageBuffer);
        } else {
            res.status(response.status).send(response.statusText);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server is running on port ${port}`);
});
