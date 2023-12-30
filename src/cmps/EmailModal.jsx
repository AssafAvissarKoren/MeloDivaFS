import React, { useState, useEffect, useRef } from 'react';
import { utilService } from '../services/util.service';

export const EmailModal = ({ isOpen, content, onClose, position }) => {
    const modalRef = useRef();
  
    // Close modal on outside clicks
    useEffect(() => {
      function handleClickOutside(event) {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);
  
    return isOpen ? (
      <div className="modal-backdrop">
        <div className="modal" ref={modalRef} style={{ top: `${position.top}px`, left: `${position.left}px` }}>
          {content}
        </div>
      </div>
    ) : null;
  };
  
  