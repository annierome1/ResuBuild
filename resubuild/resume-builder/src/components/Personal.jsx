import React from 'react';
import InputItem from './inputitems';

const Step1 = ({ userObject, handleChange }) => {
    return (
        <div className='step'>
            <h2>Personal Information</h2>
            <InputItem className='firstName' onChange={handleChange} label='First Name' placeholder='Enter your first name' name='firstName' value={userObject.firstName || ''} />
            <InputItem className='lastName' onChange={handleChange} label='Last Name' placeholder='Enter your last name' name='lastName' value={userObject.lastName || ''} />
            <InputItem className='email' onChange={handleChange} label='Email' placeholder='Enter your email' name='email' value={userObject.email || ''} />
            <InputItem className='phone' onChange={handleChange} label='Phone' placeholder='Enter your phone number' name='phone' value={userObject.phone || ''} />
            <InputItem className='website' onChange={handleChange} label='Website' placeholder='Enter your website' name='website' value={userObject.website || ''} />
        </div>
    );
};

export default Step1;
