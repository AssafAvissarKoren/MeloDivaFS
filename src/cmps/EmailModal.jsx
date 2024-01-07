import React, { useState, useEffect, useRef } from 'react';

export const EmailModal = ({ triggerRef, content, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const modalRef = useRef();

    const openModal = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
            });
            setIsOpen(true);
        }
    };

    useEffect(() => {
        // Add event listener to the trigger element
        const triggerEl = triggerRef.current;
        triggerEl.addEventListener('click', openModal);

        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            triggerEl.removeEventListener('click', openModal);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [triggerRef, onClose]);

    return isOpen ? (
        <div className="modal-backdrop">
            <div className="modal" ref={modalRef} style={{ top: `${position.top}px`, left: `${position.left}px` }}>
                {content}
            </div>
        </div>
    ) : null;
};
