import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { utilService } from '../services/util.service.js';

export const AppHeader = ({ setFilterBy }) => {
    const params = useParams();
    const [text, setText] = useState('');

    useEffect(() => {
        if (params.tab === "search") {
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
            <div className="arrow-options">
                <button className="btn-arrow-container">
                    <img
                        className="svg"
                        src={utilService.getImgUrl("../assets/imgs/arrowLeft.svg")}
                    />
                </button>
                <button className="btn-arrow-container">
                    <img
                        className="svg"
                        src={utilService.getImgUrl("../assets/imgs/arrowRight.svg")}
                    />
                </button>
            </div>
            {params.tab == "search" &&
                <label className="search-bar-container">
                    <div className="search-img-contaner">
                        <img className="search-img" src={utilService.getImgUrl("../assets/imgs/search.svg")} />
                    </div>
                    <input 
                        className="search-bar"
                        type="text" 
                        placeholder="What do you want to play?" 
                        value={text} 
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                    />
                </label>
            }
        </header>
    );
};
