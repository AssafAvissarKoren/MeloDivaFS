import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios is used to make HTTP requests

export function Search({ searchText }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        if (searchText) {
            searchVideos(searchText);
        }
    }, [searchText]);

    const searchVideos = async (query) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                    part: 'snippet',
                    maxResults: 5,
                    q: query,
                    key: 'AIzaSyC3YOy0NUIShjRXdNxhZazirA58eiMbQDI' 
                }
            });
            setVideos(response.data.items);
        } catch (error) {
            console.error('Error fetching data from YouTube API', error);
        }
    };

    return (
        <div className="search">
            <h1 style={{ color: "white" }}>Welcome to the Search Page</h1>
            {videos.map((video, index) => (
                <div key={video.id.videoId || index}>
                    <h3>{video.snippet.title}</h3>
                    <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                </div>
            ))}
        </div>
    );
}
