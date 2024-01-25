import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const AppHeader = ({ setFilterBy }) => {
    const params = useParams();
    const [text, setText] = useState('');

    useEffect(() => {
        if (params.tab !== "search") {
            setText('');
            setFilterBy(prev => ({ ...prev, text: '' }));
        }
    }, [params.tab]);


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
            {params.tab == "search" &&
                <div>
                <label htmlFor="searchInput" className="visually-hidden">Search Playlists or Songs</label>
                <input 
                    id="searchInput"
                    type="text" 
                    placeholder="Playlists or Songs" 
                    value={text} 
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                />
                </div>
            }
        </header>
    );
};
