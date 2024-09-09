import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputItem from './inputitems';
import "./experience.css"



const Step2 = ({ userObject, handleExperienceChange, handleDescriptionChange, addExperience, addDescription, removeDescription, removeExperience }) => {
    const updateDatesString = (exp) => {
        const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
        const endDate = exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
        return startDate && endDate ? `${startDate} - ${endDate}` : startDate;
    };

    return (
        <div className='step'>
            <h2>Work Experience</h2>
            {userObject.experience.map((exp, index) => (
                <div key={index} className='experience-group'>
                    <InputItem
                        className='title'
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        label='Title'
                        placeholder='Enter your job title'
                        name={`title-${index}`}
                        value={exp.title}
                    />
                    <InputItem
                        className='company'
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        label='Company'
                        placeholder='Enter company name'
                        name={`company-${index}`}
                        value={exp.company}
                    />

                    <div className="experience-date">
                        <label htmlFor={`startDate-${index}`}></label>
                        <DatePicker
                            selected={exp.startDate}
                            onChange={(date) => handleExperienceChange(index, 'startDate', date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText='Select start date'
                            name={`startDate-${index}`}
                        />
                    </div>

                    <div className="experience-date">
                        <label htmlFor={`endDate-${index}`}></label>
                        <DatePicker
                            selected={exp.endDate}
                            onChange={(date) => handleExperienceChange(index, 'endDate', date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText='Select end date'
                            name={`endDate-${index}`}
                            disabled={exp.currentlyWorking}
                        />
                    </div>

                    <div className="currently-working">
                        <input
                            type='checkbox'
                            checked={exp.currentlyWorking}
                            onChange={(e) => handleExperienceChange(index, 'currentlyWorking', e.target.checked)}
                            id={`currentlyWorking-${index}`}
                        />
                        <label htmlFor={`currentlyWorking-${index}`}>Currently Working</label>
                    </div>

                    <InputItem
                        className='location'
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        label='Location'
                        placeholder='Enter location'
                        name={`location-${index}`}
                        value={exp.location}
                    />

                    {exp.description.map((desc, descIndex) => (
                        <div key={descIndex} className='description-item'>
                            <InputItem
                                className='description'
                                onChange={(e) => handleDescriptionChange(index, descIndex, e.target.value)}
                                label={`Description ${descIndex + 1}`}
                                placeholder='Enter job description'
                                name={`description-${index}-${descIndex}`}
                                value={desc}
                            />
                            <button type='button' className = 'rbutton' onClick={() => removeDescription(index, descIndex)}>Remove Description</button>
                        </div>
                    ))}
                    

                <div className = "button-group">
                    <button type='button' className='add-description' onClick={() => addDescription(index)}>Add Description</button>
                    
                    <button type='button' className='rbutton' onClick={() => removeExperience(index)}>Remove Experience</button>
                    
                    <h3>{exp.company} <span>{updateDatesString(exp)}</span></h3>
                    </div>
                </div>
            ))}
            <div className = "nav-buttons">
            <button type='button' className = "add-experience" onClick={addExperience}>Add Experience</button>
        </div>
        </div>
    );
};

export default Step2;
