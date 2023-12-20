import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';

export const EmailDetails = () => {
    const [email, setEmail] = useState(null);
    const params = useParams() //emailId
    const navigate = useNavigate();

    useEffect(() => {
        loadEmail()
    }, [params.emailId]);

    async function loadEmail() {
        try {
            const email = await emailService.getById(params.emailId)
            setEmail(email)
        } catch (error) {
            console.log('error:', error)
        }
    }

    async function onDeleteEmail(email) {
        await emailService.saveEmail(email, ["trash"])
        goBack();
    }


    if (!email) {
        return <div>Loading email...</div>;
    }

    function goBack() {
        const pathArray = window.location.hash.split('/');
        const newPath = '/' + pathArray.slice(1, 2).join('/');
        navigate(newPath);
    }


    return (
        <div className="email-details">
            <button onClick={() => {goBack()}}>Back to list</button>
            <h2>{email.subject}</h2>
            <p>From: {email.from}</p>
            <p>To: {email.to}</p>
            <p>Sent: {new Date(email.sentAt).toLocaleString()}</p>
            <div>{email.body}</div>
            <button onClick={() => onDeleteEmail(email)}>Delete Email</button>
        </div>
    );
};
