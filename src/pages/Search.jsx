import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Category, Status } from '../cmps/Category';
import imgUrl from '../assets/imgs/MeloDiva.png';
import { categoryService } from '../services/category.service';
import { FooterPlayer } from '../cmps/FooterPlayer';


export function Search({ stations, searchText, setCurrentCategory }) {
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

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

    const getStationsForCategory = (categoryIds) => {
        return stations.filter(station => categoryIds.includes(station._id));
    };

    const handleVideoClick = (video) => { //here comes the boom
        console.log("handleVideoClick", video)
        setSelectedVideo(video);
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
                        <Category 
                            key={category.categoryName}
                            stations={getStationsForCategory(category.stationsIds)}
                            category_name={category.categoryName}
                            category_color={category.categoryColor}
                            category_image={imgUrl}
                            style={Status.CUBE}
                            setCurrentCategory={setCurrentCategory}
                        />
                    ))}
                </>
            )} // 
            {selectedVideo && <FooterPlayer video={selectedVideo} />}
        </div>
    );
}
