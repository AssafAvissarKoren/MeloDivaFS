import React, { useState } from 'react';
import { emailService } from '../services/email.service';
import { storageService } from '../services/async-storage.service.js'
import { useNavigate, useParams } from 'react-router-dom';

export const EmailCompose = () => {
    const [emailForm, setEmailForm] = useState({
        to: '',
        subject: '',
        body: ''
    });
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newEmail = await emailService.createEmail(
            emailForm.subject,
            emailForm.body,
            emailForm.to,
        );
        //storageService.put(newEmail)
        await emailService.saveEmail(newEmail, "sent")
        navigate('/email');
    };

    return (
        <div className="email-compose">
        <form onSubmit={handleSubmit}>
            <input type="email" name="to" placeholder="To" value={emailForm.to} onChange={handleChange} required />
            <input type="text" name="subject" placeholder="Subject" value={emailForm.subject} onChange={handleChange} required />
            <textarea name="body" placeholder="Compose email" value={emailForm.body} onChange={handleChange} required />
            <button type="submit">Send</button>
        </form>
        </div>
    );
};
