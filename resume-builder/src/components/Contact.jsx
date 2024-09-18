import React from 'react';
import './Contact.css';

const Popup = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; // If the modal is closed, render nothing

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;
