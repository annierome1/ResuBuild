import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputItem from './inputitems';

const Step3 = ({ userObject, handleChange, handleDateChange, handleExtracurricularChange, removeExtracurricular, addExtracurricular, handleGPAChange, removeGPA, addGPA}) => {
    return (
        <div className='step'>
            <h2>Education</h2>
            <InputItem className='uni' onChange={handleChange} label='University' placeholder='Enter University Name' name='uni' value={userObject.uni || ''} />
            <InputItem className='degree' onChange={handleChange} label='Degree' placeholder='Enter Degree' name='degree' value={userObject.degree || ''} />
            <InputItem className='city' onChange={handleChange} label='City' placeholder='Enter location' name='city' value={userObject.city || ''} />
            <div className='input-item'>
                <label htmlFor='gradDate'></label>
                <DatePicker
                    selected={userObject.gradDate ? new Date(userObject.gradDate) : null}
                    onChange={(date) => handleDateChange('gradDate', date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText='Select Graduation Date'
                    className='gradDate-picker'
                />
            </div>
            
            <div className='extracurriculars'>
                <h3>Extracurricular Activities</h3>
                {userObject.extracurriculars && userObject.extracurriculars.map((activity, index) => (
                    <div key={index} className='extracurricular-item'>
                        <InputItem className='activity' onChange={(e) => handleExtracurricularChange(index, e.target.value)} label={`Activity ${index + 1}`} placeholder='Enter Activity' name={`activity-${index}`} value={activity} />
                        <button className = 'rbutton' type='button' onClick={() => removeExtracurricular(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addExtracurricular}>Add Activity</button>
            </div>

            <div className='gpa'>
                <h3>GPA</h3>
                {userObject.gpaEntries && userObject.gpaEntries.map((gpaEntry, index) => (
                    <div key={index} className='gpa-item'>
                        <InputItem className='gpa' onChange={(e) => handleGPAChange(index, e.target.value)} label={`GPA ${index + 1}`} placeholder='Enter GPA' name={`gpa-${index}`} value={gpaEntry} />
                        <button type='button' className='rbutton' onClick={() => removeGPA(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addGPA}>Add GPA</button>
            </div>
        </div>
    );
};

export default Step3;
