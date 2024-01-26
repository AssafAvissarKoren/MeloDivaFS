import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { utilService } from '../services/util.service.js'
import { dataService } from '../services/data.service.js'
import { Slider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward, faRedo, faRandom } from '@fortawesome/free-solid-svg-icons';


export function FooterPlayer({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoDuration, setVideoDuration] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(50); // Initial volume (0-100)
    const playerRef = useRef(null);
    const thumbnailUrl = video.snippet.thumbnails.default.url;

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 0,
            controls: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            enablejsapi: 1,
        },
    };
    
    useEffect(() => {
        let interval;

        if (isPlaying) {
            interval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    setCurrentTime(playerRef.current.getCurrentTime());
                }
            }, 1000); // Update every second
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    const onReady = (event) => {
        // Store the player reference when ready
        playerRef.current = event.target;
    };

    const togglePlay = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (video && video.id.videoId) {
            const fetchVideoDuration = async () => {
                try {
                    const durations = await dataService.getDurations(video.id.videoId);
                    if (durations) {
                        setVideoDuration(durations[0]);
                    }
                } catch (error) {
                    console.error('Error fetching video duration', error);
                }
            };
            fetchVideoDuration();
        }
    }, [video.id.videoId]);

    const formatTime = (timeInSeconds) => {
        const seconds = Math.floor(timeInSeconds % 60);
        const minutes = Math.floor(timeInSeconds / 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const changeVolume = (newVolume) => {
        if (playerRef.current) {
            // Ensure the volume is within the valid range (0-100)
            const validVolume = Math.min(100, Math.max(0, newVolume));
            playerRef.current.setVolume(validVolume);
            setVolume(validVolume);
        }
    };

    // Event handlers for player actions (not implemented in this example)
    const shuffleQueue = () => { /* ... */ };
    const playNext = () => { /* ... */ };
    const playPrev = () => { /* ... */ };
    const toggleRepeat = () => { /* ... */ };

    // console.log("channelTitle", video.snippet.channelTitle)
    // console.log("title", video.snippet.title)
    
    return (//player-controls
        <footer className="footer-player">
            <div className="video-thumbnail">
                {thumbnailUrl && <img src={thumbnailUrl} alt={`${video.snippet.title} thumbnail`} />}
            </div>
            <div className="video-info">
                <div className="video-name">{video.snippet.title}</div>
                <div className="channel-name">{video.snippet.channelTitle}</div>
            </div>
            <div className="player-controls">
                <div className="player-action-buttons">
                    <button onClick={shuffleQueue} name="shuffle">
                        <FontAwesomeIcon icon={faRandom} />
                    </button>
                    <button onClick={playPrev} name="previous">
                        <FontAwesomeIcon icon={faStepBackward} />
                    </button>
                    <button onClick={togglePlay} name="play-pause">
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                    </button>
                    <button onClick={playNext} name="next">
                        <FontAwesomeIcon icon={faStepForward} />
                    </button>
                    <button onClick={toggleRepeat} name="repeat">
                        <FontAwesomeIcon icon={faRedo} />
                    </button>
                </div>
                {videoDuration && (
                    <div className="progress-section">
                        <span className="current-time">{formatTime(currentTime)}</span>
                        <Slider
                            className="slider"
                            value={currentTime}
                            max={utilService.durationInSeconds(videoDuration)}
                            onChange={(event, newValue) => {
                                setCurrentTime(newValue);
                                if (playerRef.current) {
                                    playerRef.current.seekTo(newValue);
                                }
                            }}                    
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => formatTime(value)}
                        />
                        <span className="end-time">{utilService.formatDuration(videoDuration)}</span>
                    </div>
                )}
            </div>
            <div className="volume-control">
                <button onClick={() => changeVolume(volume - 10)}>-</button>
                <p>Vol: {volume}%</p>
                <button onClick={() => changeVolume(volume + 10)}>+</button>
            </div>
            <div className="youtube-container">
                <YouTube videoId={video.id.videoId} opts={opts} onReady={onReady} />
            </div>
        </footer>
    );
}
