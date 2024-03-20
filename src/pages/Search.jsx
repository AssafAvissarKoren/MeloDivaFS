import React, { useState, useEffect } from 'react';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx';
import { categoryService } from '../services/category.service';
import { dataService } from '../services/data.service.js';
import { getCurrentTrackInQueue, setQueueToTrack } from '../store/actions/queue.actions.js';
import { trackService } from '../services/track.service.js';
import { useSelector } from 'react-redux';
import { utilService } from '../services/util.service.js';
import { TrackPreview } from '../cmps/TrackPreview.jsx';
import { getStationById, saveStation } from '../store/actions/station.actions.js';
import { getIsTrackPlaying } from '../store/actions/player.actions.js';


export function Search({ searchText }) {
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
            const items = await dataService.searchYoutube(query);
            const validItems = items.filter(video => video.id.videoId); // Filter out items with undefined video.url
            const videos = validItems.map(video => ({...trackService.videoToTrack(video)}))
            console.log('videos', videos)
            
            const videoIds = videos.map(video => {
                if (video.url.includes('=')) {
                    const urlParts = video.url.split('=');
                    return urlParts[urlParts.length - 1];
                } else {
                    return video.url;
                }
            }).join(',');
            
            const trackDurations =  await dataService.getDurations(videoIds)
            const tracks = validItems.map((video, index)=> {
                return {
                    ...trackService.videoToTrack(video), 
                    duration: trackDurations[index]
                }
            })
            console.log('tracks', tracks)
            setTracks(tracks)
        } catch (error) {
            console.error('Error fetching data from YouTube API', error);
        }
    };

    const handleTrackClick = (track) => {
        if(getCurrentTrackInQueue().url === track.url) {
            getIsTrackPlaying() ? pause() : play()
        } else {
            setQueueToStation(station, trackNum-1);
        }
    }

    async function addTrackToStation(track, stationId) {
        try {
            const station = await getStationById(stationId)
            const tracks = station.tracks
            tracks.push(track)
            await saveStation({...station, tracks: tracks})
            eventBusService.showSuccessMsg(`Added to ${station.name}.`)
        } catch (err) {
            eventBusService.showErrorMsg('faild to add track to station.')
            console.log(err)
        }
    }

    if (!stations || !categories.length) {
        return <div></div> //Loading...
    } else {
        return (
            <div className="search">
                <h1>Browse All</h1>
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
                                    addTrackToStation={addTrackToStation}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="search-categories">
                        {categories.map(category => (
                            <CategoryDisplay 
                                key={category._id}
                                category={category}
                                style={categoryService.Status.CUBE}
                            />
                        ))}
                    </div>
                )} // 
            </div>
        );
    }
}
