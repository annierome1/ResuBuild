import React, { useEffect, useRef } from 'react';
import './inputitems.css';

const InputItem = ({ label, placeholder = ' ', name, onChange, type = 'text', isTextArea = false, className, value }) => {
    const textareaRef = useRef(null);

    // Function to auto-adjust height
    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; 
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Expand dynamically
        }
    };

    useEffect(() => {
        adjustHeight(); 
    }, [value]);

    return (
        <div className={`row ${className}`}> 
            <div className='input'>
                {!isTextArea ? (
                    <input 
                        onChange={onChange} 
                        placeholder={placeholder} 
                        name={name} 
                        type={type} 
                        value={value} 
                    />
                ) : (
                    <textarea 
                        ref={textareaRef}
                        onChange={(e) => {
                            onChange(e);
                            adjustHeight(); // Adjust height dynamically on input
                        }}
                        placeholder={placeholder} 
                        name={name}
                        value={value} 
                        rows="1" // Start with 1 row
                        style={{ minHeight: "40px", resize: "none", overflow: "hidden" }}
                    ></textarea>
                )}
                <label>{label}</label>
            </div>
        </div>
    );
};

export default InputItem;
