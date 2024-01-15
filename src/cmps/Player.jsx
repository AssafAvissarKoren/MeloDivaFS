import React from 'react';
import YouTube from 'react-youtube';
import './FooterPlayer.css'; // Import the CSS file for styling

export default function FooterPlayer({ videoId }) {
    const opts = {
        height: '90', // Adjusted for a footer layout
        width: '160', // Adjusted for a footer layout
        playerVars: {
            autoplay: 0, // Autoplay disabled as a common best practice
        },
    };

    const onReady = (event) => {
        // Access to player in all event handlers via event.target
        event.target.pauseVideo();
    };

    return (
        <footer className="footer-player">
            <YouTube videoId={videoId} opts={opts} onReady={onReady} />
        </footer>
    );
}
