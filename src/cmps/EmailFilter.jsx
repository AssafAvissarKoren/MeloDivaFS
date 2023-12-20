import React, { useState, useEffect } from 'react';

export const EmailFilter = ({ filterBy, onSetFilter }) => {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    const handleChange = (event) => {
        const { name: field, value } = event.target;
        let finalValue;
    
        if (field === "isRead") {
            finalValue = value === "all" ? null : value === "true";
        } else {
            finalValue = value;
        }
    
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: finalValue }));
    };
            
    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    const { status, text, isRead } = filterByToEdit

    return (
        <div className="email-filter">
            <select name="status" onChange={handleChange} value={status} style={{ margin: '10px' }}>
                <option value="all">All</option>
                <option value="inbox">Inbox</option>
                <option value="sent">Sent</option>
                <option value="star">Star</option>
                <option value="trash">Trash</option>
            </select>

            <input 
                type="text" 
                name="text"
                placeholder="Search emails" 
                value={text} 
                onChange={handleChange} 
            />

            <select name="isRead" onChange={handleChange} value={isRead === null ? 'all' : isRead.toString()} style={{ margin: '10px' }}>
                <option value="all">All</option>
                <option value="true">Read</option>
                <option value="false">Unread</option>
            </select>
        </div>
    );
};
