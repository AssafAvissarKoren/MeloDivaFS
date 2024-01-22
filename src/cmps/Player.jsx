import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';

export function FooterPlayer({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoDuration, setVideoDuration] = useState('');
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

    const formatTime = (timeInSeconds) => {
        const seconds = Math.floor(timeInSeconds % 60);
        const minutes = Math.floor(timeInSeconds / 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const durationInSeconds = (isoDuration) => {
        // const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        // if (!match) return 0;
        // const hours = (parseInt(match[1], 10) || 0);
        // const minutes = (parseInt(match[2], 10) || 0) + hours * 60;
        // const seconds = (parseInt(match[3], 10) || 0);

        const { hours, minutes, seconds } = isoMatch(isoDuration);
        return minutes * 60 + seconds;
    };

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
        const fetchVideoDuration = async () => {
            try {
                const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                    params: {
                        part: 'contentDetails',
                        id: video.id.videoId,
                        key: 'AIzaSyC3YOy0NUIShjRXdNxhZazirA58eiMbQDI'
                    }
                });
                const duration = response.data.items[0].contentDetails.duration;
                setVideoDuration(duration); // Store duration in state
            } catch (error) {
                console.error('Error fetching video duration', error);
            }
        };

        fetchVideoDuration();
    }, [video.id.videoId]);

    const isoMatch = (isoDuration) => {
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return 0;
        const hours = (parseInt(match[1], 10) || 0);
        const minutes = (parseInt(match[2], 10) || 0) + hours * 60;
        const seconds = (parseInt(match[3], 10) || 0);

        return {hours: hours, minutes: minutes, seconds: seconds};
    };

    const formatDuration = (isoDuration) => {
        // const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        // if (!match) return 0;
        // const hours = (parseInt(match[1], 10) || 0);
        // const minutes = (parseInt(match[2], 10) || 0) + hours * 60;
        // const seconds = (parseInt(match[3], 10) || 0);
        const { hours, minutes, seconds } = isoMatch(isoDuration);
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
            <div className="progress-bar">
                <span className="current-time">{formatTime(currentTime)}</span>
                <progress value={currentTime} max={durationInSeconds(videoDuration)}></progress>
                <span className="end-time">{formatDuration(videoDuration)}</span>
            </div>
            <div className="volume-control">
                {/* Volume control elements */}
            </div>
            <div className="youtube-container">
                <YouTube videoId={video.id.videoId} opts={opts} onReady={onReady} />
            </div>
    </footer>
    );
}
