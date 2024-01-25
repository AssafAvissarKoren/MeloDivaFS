import React, { useState, useEffect } from 'react';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx';
import imgUrl from '../assets/imgs/MeloDiva.png';
import { categoryService } from '../services/category.service';
import { FooterPlayer } from '../cmps/FooterPlayer';
import { dataService } from '../services/data.service.js';
import { setQueueToTrack } from '../store/actions/queue.actions.js';
import { trackService } from '../services/track.service.js';


export function Search({ stations, searchText, setCurrentCategory }) {
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await categoryService.getCategories();
            setCategories(fetchedCategories);
        };
    
        fetchCategories();
    }, []);
    
    useEffect(() => {
        if (searchText) {
            searchVideos(searchText);
        }
    }, [searchText]);

    const searchVideos = async (query) => {
        try {
            const response = await dataService.searchYoutube(query);
            setVideos(response.data.items);
        } catch (error) {
            console.error('Error fetching data from YouTube API', error);
        }
    };

    const handleVideoClick = (video) => { //here comes the boom
        setQueueToTrack(trackService.videoToTrack(video))
    };

    if (!stations || !categories.length) return <div>Loading...</div>;
    
    return (
        <div className="search">
            {searchText ? (
                <>
                    {videos.map((video, index) => (
                        <div key={video.id.videoId || index} onClick={() => handleVideoClick(video)}>
                            <h3>{video.snippet.title}</h3>
                            <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    {categories.map(category => (
                        <CategoryDisplay 
                            key={category._id}
                            category={category}
                            style={categoryService.Status.CUBE}
                            setCurrentCategory={setCurrentCategory}
                        />
                    ))}
                </>
            )} // 
        </div>
    );
}
