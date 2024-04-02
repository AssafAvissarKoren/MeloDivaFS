import React from 'react';
import { Slider } from '@mui/material';
import { utilService } from '../services/util.service.js';

export function ProgressSection({ currentTime, videoDuration, playerRef, setCurrentTime }) {

    const formatTime = (timeInSeconds) => {
        const seconds = Math.floor(timeInSeconds % 60);
        const minutes = Math.floor(timeInSeconds / 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="progress-section">
        <span className="current-time">{formatTime(currentTime)}</span>
        <Slider
            className="progress-slider"
            value={currentTime}
            max={utilService.durationInSeconds(videoDuration)}
            onChange={(event, newValue) => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    setCurrentTime(Math.round(newValue));
                    playerRef.current.seekTo(newValue);
                }
            }}                    
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatTime(value)}
        />
        <span className="end-time">{utilService.formatDuration(videoDuration)}</span>
    </div>
    )
}

