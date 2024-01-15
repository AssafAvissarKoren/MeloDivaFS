import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppHeader = ({ setFilterBy }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        setFilterBy(prev => ({ ...prev, text }));
    }, [text, setFilterBy]);

    const handleTextChange = (e) => {
        setText(e.target.value);
        setFilterBy(prev => ({ ...prev, text: e.target.value }));
    };

    return (
        <header className="app-header">
            <input 
                type="text" 
                placeholder="Playlists or Songs" 
                value={text} 
                onChange={handleTextChange}
            />
        </header>
    );
};
