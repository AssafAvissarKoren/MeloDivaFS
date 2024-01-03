import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';
import { utilService } from '../services/util.service';
import { eventBusService, showErrorMsg, showSuccessMsg } from "../services/event-bus.service";

export const EmailCompose = ({ closeModal }) => {
    const defaultForm = { to: '', subject: '', body: '', folder: 'drafts' };
    const [draftEmail, setDraftEmail] = useState({ to: '', subject: '', body: '', folder: 'drafts' });
    const [lastSavedForm, setLastSavedForm] = useState({ to: '', subject: '', body: '', folder: 'drafts' });
    
    const navigate = useNavigate();
    const params = useParams()
    
    useEffect(() => {
        const initializeDraft = async () => {
            let startDraft;
            if (params.folder === 'drafts' && params.emailId) {
                startDraft = await loadDraft(params.emailId);
            } else {
                startDraft = await createNewDraft();
            }
            if (startDraft) {
                setDraftEmail(startDraft);
                setLastSavedForm({to: startDraft.to, subject: startDraft.subject, body: startDraft.body});
            } else {
                setDraftEmail(defaultForm);
                setLastSavedForm(defaultForm);
            }
        };
        initializeDraft();
    }, [params.folder, params.emailId]);
    
    const createNewDraft = async () => {
        try {
            return await emailService.createEmail(defaultForm.to, defaultForm.subject, defaultForm.body, "drafts");
        } catch (error) {
            console.log('error:', error)
        }
    };

    const loadDraft = async (emailId) => {
        try {
            return await emailService.getById(emailId)
        } catch (error) {
            console.log('error:', error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDraftEmail(prevDraft => ({ ...prevDraft, [name]: value}));
    };
        
    function isFormChanged() {
        return draftEmail.to !== lastSavedForm.to ||
               draftEmail.subject !== lastSavedForm.subject ||
               draftEmail.body !== lastSavedForm.body;
    }
    
    const saveDraft = async () => {
        if(isFormChanged()) {
            setDraftEmail(await emailService.saveEmail(draftEmail, "drafts"));
            setLastSavedForm({to: draftEmail.to, subject: draftEmail.subject, body: draftEmail.body});
        }
    };
    
    useEffect(() => {
        const intervalId = setInterval(saveDraft, 5000);

        return async () => {
            clearInterval(intervalId);
            await saveDraft();
            try {
                // eventBusService.emit('draft-saved', { type: 'success', txt: 'Email draft saved successfully' });
                showSuccessMsg('Email draft saved successfully');
            } catch (error) {
                console.error('Error saving draft:', error);
                // eventBusService.emit('draft-saved', { type: 'error', txt: 'Could not save draft' });
                showErrorMsg('Could not reset emails');
            }
        };
    }, [draftEmail, lastSavedForm]);
    
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
        
            let emailToSave;
            if (!lastSavedForm && draftEmail) {
                // If there's no draft, create a new one and use it
                emailToSave = await emailService.createEmail(draftEmail.subject, draftEmail.body, draftEmail.to, "drafts");
            } else {
                // If there's an existing draft, use it
                emailToSave = draftEmail;
            }
        
            // Save the email to 'sent'
            await emailService.saveEmail(emailToSave, "sent");
            navigate('/email');
            showSuccessMsg('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            showErrorMsg('Could not send email');
        }

    };
    
    return (
        <div className="email-compose-modal">
            <button className="close-modal" onClick={closeModal}>X</button>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="to" 
                    placeholder="To" 
                    value={draftEmail ? draftEmail.to : ''} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="subject" 
                    placeholder="Subject" 
                    value={draftEmail ? draftEmail.subject : ''} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="body" 
                    placeholder="Compose email" 
                    value={draftEmail ? draftEmail.body : ''} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};
