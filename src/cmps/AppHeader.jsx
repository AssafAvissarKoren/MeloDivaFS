import React, { useState } from 'react';

export const AppHeader = ({ setFilterBy }) => {
    const [text, setText] = useState('');

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setFilterBy(prev => ({ ...prev, text }));
        }
    };

    return (
        <header className="app-header">
            <input 
                type="text" 
                placeholder="Playlists or Songs" 
                value={text} 
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
            />
        </header>
    );
};
