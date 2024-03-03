import React, { useState, useEffect } from 'react';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx';
import imgUrl from '../assets/imgs/MeloDiva.png';
import { categoryService } from '../services/category.service';
import { FooterPlayer } from '../cmps/FooterPlayer';
import { dataService } from '../services/data.service.js';
import { setQueueToTrack } from '../store/actions/queue.actions.js';
import { trackService } from '../services/track.service.js';
import { useSelector } from 'react-redux';
import { utilService } from '../services/util.service.js';
import { TrackPreview } from '../cmps/TrackPreview.jsx';


export function Search({ searchText, setCurrentCategory }) {
    const [tracks, setTracks] = useState([]);
    const [categories, setCategories] = useState([]);
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)

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
            const videos = response.data.items.map(video => ({...trackService.videoToTrack(video)}))
            
            const videoIds = videos.map(video => {
                // Assuming the URL contains the video ID at the end after '='
                const urlParts = video.url.split('=');
                return urlParts[urlParts.length - 1]
            }).join(',')

            const trackDurations =  await dataService.getDurations(videoIds)
            const tracks = response.data.items.map((video, index)=> {
                return {
                    ...trackService.videoToTrack(video), 
                    duration: trackDurations[index]
                }
            })
            setTracks(tracks)
        } catch (error) {
            console.error('Error fetching data from YouTube API', error);
        }
    };

    const handleTrackClick = (track) => { //here comes the boom
        setQueueToTrack(track)
    };

    if (!stations || !categories.length) return <div>Loading...</div>;
    
    return (
        <div className="search">
            {searchText ? (
                <>
                    {tracks.map((track, index) => (
                        <div key={track.url || index}>
                            <TrackPreview 
                                layout={'search-track-layout'}
                                track={track} 
                                isLiked={likedTracks[track.url] ? true : false}
                                duration={utilService.formatDuration(track.duration)}
                                handleTrackClick={handleTrackClick}
                            />
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
