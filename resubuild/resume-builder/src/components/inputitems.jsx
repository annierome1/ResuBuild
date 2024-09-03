import React from 'react'
import './inputitems.css';

const InputItem = ({label, placeholder = ' ', name, onChange, type = 'text', isTextArea = false, className}) => {
    return (
        <div className = {'row ${className}'}>
            <div className = 'input'>
                {!isTextArea ? <input onChange = {onChange} placeholder = {placeholder} name = {name} type = {type}/>
                : <textarea onChange = {onChange} placeholder = {placeholder} name ={name}></textarea>}

                <label>{label}</label>
            </div>
        </div>
    )
}

export default InputItem 