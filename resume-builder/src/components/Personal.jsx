import React from 'react';
import InputItem from './inputitems';

const Step1 = ({ userObject, handleChange }) => {
    return (
        <div className='step'>
            <h2>Personal Information</h2>
            <InputItem className='resumeName' onChange={handleChange} label='Resume Name' placeholder='Enter a name for this resume'  name='resumeName' value={userObject.resumeName || ''} />
            <InputItem className='firstName' onChange={handleChange} label='First Name' placeholder='Enter your first name' name='firstName' value={userObject.firstName || ''} />
            <InputItem className='lastName' onChange={handleChange} label='Last Name' placeholder='Enter your last name' name='lastName' value={userObject.lastName || ''} />
            <InputItem className='email' onChange={handleChange} label='Email' placeholder='Enter your email' name='email' value={userObject.email || ''} />
            <InputItem className='phone' onChange={handleChange} label='Phone' placeholder='Enter your phone number' name='phone' value={userObject.phone || ''} />
            <InputItem className='website' onChange={handleChange} label='Website' placeholder='Enter your website' name='website' value={userObject.website || ''} />
            <InputItem className ='statement' onChange={handleChange} label = "Statement" placeholder='Enter your statement' name ='statement' value={userObject.statement || ''} />
        </div>
    );
};

export default Step1;


