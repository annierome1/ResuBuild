import React from 'react';
import './inputitems.css';

const InputItem = ({ label, placeholder = ' ', name, onChange, type = 'text', isTextArea = false, className, value }) => {
    return (
        <div className={`row ${className}`}> {/* Fixed template string */}
            <div className='input'>
                {/* Use value prop for controlled inputs */}
                {!isTextArea ? (
                    <input 
                        onChange={onChange} 
                        placeholder={placeholder} 
                        name={name} 
                        type={type} 
                        value={value} // Bind value to the state
                    />
                ) : (
                    <textarea 
                        onChange={onChange} 
                        placeholder={placeholder} 
                        name={name}
                        value={value} // Bind value to the state
                    ></textarea>
                )}
                <label>{label}</label>
            </div>
        </div>
    );
};

export default InputItem;
