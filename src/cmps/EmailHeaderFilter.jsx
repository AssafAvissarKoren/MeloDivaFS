import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const EmailHeaderFilter = ({ setFilterBy }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        setFilterBy(prev => ({ ...prev, text }));
    }, [text, setFilterBy]);

    const handleTextChange = (e) => {
        setText(e.target.value);
        setFilterBy(prev => ({ ...prev, text: e.target.value }));
    };

    return (
        <header className="email-header">
            <input 
                type="text" 
                placeholder="Search emails" 
                value={text} 
                onChange={handleTextChange}
            />
        </header>
    );
};
