import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emailService } from '../services/email.service';
import { eventBusService } from "../services/event-bus.service";
import { Formik, Form, Field } from 'formik';
import { TextField, Button, FormControl, TextareaAutosize } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompressAlt, faExpandAlt, faSave } from '@fortawesome/free-solid-svg-icons';

export const EmailCompose = ({ closeModal }) => {
    const defaultForm = { to: '', subject: '', body: '', folder: 'drafts' };
    const [draftEmail, setDraftEmail] = useState(defaultForm);
    const [lastSavedForm, setLastSavedForm] = useState(defaultForm);
    
    const navigate = useNavigate();
    const params = useParams()
    
    useEffect(() => {
        const initializeDraft = async () => {
            let startDraft;
            if (params.folder === 'drafts' && params.emailId) {
                startDraft = await loadDraft(params.emailId);
            } else {
                startDraft = await createNewDraft(); //fix this to save a new draft only if there has been a change from blank
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
            return await emailService.createEmail(defaultForm.subject, defaultForm.body, defaultForm.to);
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

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setDraftEmail(prevDraft => ({ ...prevDraft, [name]: value}));
    // };
        
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
                eventBusService.showSuccessMsg('Email draft saved successfully');
            } catch (error) {
                console.error('Error saving draft:', error);
                eventBusService.showErrorMsg('Could not reset emails');
            }
        };
    }, [draftEmail, lastSavedForm]);
    
    const handleFormSubmit  = async (values) => {
        console.log("values.body", values.body)
        try {
            let emailToSave = await emailService.createEmail(values.subject, values.body, values.to, "sent");
            await emailService.saveEmail(emailToSave, "sent");
            navigate('/email');
            eventBusService.showSuccessMsg('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            eventBusService.showErrorMsg('Could not send email');
        }
    };

    function handleMinimize() {
        return null;
    }
    function handleFullScreen() {
        return null;
    }
    function handleClose() {
        closeModal();
        return null;
    }

    return (
        <div className="email-compose-modal">
            <div className="modal-top-bar">
                <span>New Message</span>
                <span>
                    <Button className="modal-button" title="Minimize" onClick={handleMinimize}>
                        <FontAwesomeIcon icon={faCompressAlt} />
                    </Button>
                    <Button className="modal-button" title="Full screen (Shift for pop-out)" onClick={handleFullScreen} >
                        <FontAwesomeIcon icon={faExpandAlt} />
                    </Button>
                    <Button className="modal-button" title="Save & Close" onClick={handleClose} >
                        <FontAwesomeIcon icon={faSave} />
                    </Button>
                </span>
            </div>
            <Formik
                initialValues={defaultForm}
                onSubmit={handleFormSubmit}
                enableReinitialize
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Field
                            as={TextField}
                            type="email"
                            name="to"
                            label="Recipients"
                            value={values.to}
                            onChange={handleChange}
                            required
                            variant="standard"
                        />

                        <Field
                            as={TextField}
                            type="text"
                            name="subject"
                            label="Subject"
                            value={values.subject}
                            onChange={handleChange}
                            required
                            variant="standard"
                        />

                        <FormControl fullWidth margin="normal">
                            <TextareaAutosize
                                name="body"
                                placeholder="Compose email"
                                minRows={15}
                                value={values.body}
                                onChange={handleChange}
                                required
                                style={{ width: '100%' }}
                            />
                        </FormControl>

                        <Button type="submit" variant="contained">Send</Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
