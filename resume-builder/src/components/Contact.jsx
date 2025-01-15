import React from "react";

const PopUp = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; // Do not render if not open

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{title}</h2>
                <button onClick={onClose} className="popup-close-button">X</button>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default PopUp;
