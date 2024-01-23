import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { utilService } from '../services/util.service.js'

export function FooterPlayer({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoDuration, setVideoDuration] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
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
                    const durations = await utilService.getDurations(video.id.videoId);
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

    // Event handlers for player actions (not implemented in this example)
    const playNext = () => { /* ... */ };
    const playPrev = () => { /* ... */ };
    const toggleRepeat = () => { /* ... */ };

    return (
        <footer className="footer-player">
            <div className="video-thumbnail">
                {thumbnailUrl && <img src={thumbnailUrl} alt={`${video.snippet.title} thumbnail`} />}
            </div>
            <div className="video-info">
                <div className="video-name">{video.snippet.title}</div>
                <div className="channel-name">{video.snippet.channelTitle}</div>
            </div>
            <div className="player-controls">
                <button onClick={playPrev}>Prev</button>
                <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
                <button onClick={playNext}>Next</button>
                <button onClick={toggleRepeat}>Repeat</button>
            </div>
            {videoDuration && (
                <div className="progress-bar">
                    <span className="current-time">{formatTime(currentTime)}</span>
                    <progress value={currentTime} max={utilService.durationInSeconds(videoDuration)}></progress>
                    <span className="end-time">{utilService.formatDuration(videoDuration)}</span>
                </div>
            )}
            <div className="volume-control">
                {/* Volume control elements */}
            </div>
            <div className="youtube-container">
                <YouTube videoId={video.id.videoId} opts={opts} onReady={onReady} />
            </div>
    </footer>
    );
}
