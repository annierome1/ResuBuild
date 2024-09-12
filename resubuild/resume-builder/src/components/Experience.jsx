import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputItem from './inputitems';
import './experience.css';

const Step2 = ({ 
    userObject, 
    handleExperienceChange, 
    handleDescriptionChange, 
    addExperience, 
    addDescription, 
    removeDescription, 
    removeExperience 
}) => {
    const [suggestions, setSuggestions] = useState({});
    const [showSuggestions, setShowSuggestions] = useState({});

    // Fetch AI suggestions based on job title
    const getSuggestions = async (title, index) => {
        if (!title) return;

        try {
            const response = await fetch('http://localhost:5001/api/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }), // Send the job title to the backend
            });

            if (response.ok) {
                const data = await response.json();

                // Assuming data.suggestions[0] contains all descriptions as a single string
                const splitSuggestions = data.suggestions[0]
                    .split(/(\d\.\s)/)  // Split on numbers like "1. ", "2. ", "3. "
                    .filter(text => text.trim() && !/^\d\.\s/.test(text));  // Remove empty elements and numbers

                const newSuggestions = { ...suggestions, [index]: splitSuggestions };
                setSuggestions(newSuggestions);

                // Show suggestions for the relevant experience index
                const updatedShowSuggestions = { ...showSuggestions, [index]: true };
                setShowSuggestions(updatedShowSuggestions);

            } else {
                console.error('Error fetching suggestions');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Update string for start and end dates
    const updateDatesString = (exp) => {
        const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
        const endDate = exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
        return startDate && endDate ? `${startDate} - ${endDate}` : startDate;
    };

    return (
        <div className='step'>
            <h2>Work Experience</h2>
            {userObject.experience.map((exp, index) => (
                <div key={index} className='experience-input-group'>
                    {/* Job Title Input: Fetch AI Suggestions on change */}
                    <InputItem
                        className='title'
                        onChange={(e) => {
                            handleExperienceChange(index, 'title', e.target.value);
                            getSuggestions(e.target.value, index); // Fetch suggestions on title change
                        }}
                        label='Title'
                        placeholder='Enter your job title'
                        name={`title-${index}`}
                        value={exp.title || ''}
                    />

                    {/* Company Name Input */}
                    <InputItem
                        className='company'
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        label='Company'
                        placeholder='Enter company name'
                        name={`company-${index}`}
                        value={exp.company}
                    />

                    {/* Start Date Picker */}
                    <div className="experience-date">
                        <DatePicker
                            selected={exp.startDate}
                            onChange={(date) => handleExperienceChange(index, 'startDate', date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText='Select start date'
                            name={`startDate-${index}`}
                        />
                    </div>

                    {/* End Date Picker */}
                    <div className="experience-date">
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

                    {/* Currently Working Checkbox */}
                    <div className="currently-working">
                        <input
                            type="checkbox"
                            checked={exp.currentlyWorking}
                            onChange={(e) => handleExperienceChange(index, 'currentlyWorking', e.target.checked)}
                            id={`currentlyWorking-${index}`}
                        />
                        <label htmlFor={`currentlyWorking-${index}`} style={{ display: 'inline-block', marginLeft: '8px' }}>
                            Currently Working
                        </label>
                    </div>

                    {/* Location Input */}
                    <InputItem
                        className='location'
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        label='Location'
                        placeholder='Enter location'
                        name={`location-${index}`}
                        value={exp.location}
                    />

                    {/* Descriptions Input */}
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
                            <button type='button' className='rbutton' onClick={() => removeDescription(index, descIndex)}>Remove Description</button>
                        </div>
                    ))}

                    {/* Show/Hide AI Suggestions */}
                    {showSuggestions[index] ? (
                        <div className='suggestions-box'>
                            <button type="button" className="close-button" onClick={() => setShowSuggestions({ ...showSuggestions, [index]: false })}>X</button>
                            <h4>Suggested Descriptions:</h4>
                            {suggestions[index].map((suggestion, i) => (
                                <p key={i}>{suggestion.trim()}</p>
                            ))}
                            {/* Refresh Suggestions */}
                            <button type='button' onClick={() => getSuggestions(exp.title, index)}>Refresh Suggestions</button>
                        </div>
                    ) : (
                        <button type='button' onClick={() => setShowSuggestions({ ...showSuggestions, [index]: true })}>
                            Show Suggestions
                        </button>
                    )}

                    {/* Add/Remove Experience Buttons */}
                    <div className="button-group">
                        <button type='button' className='add-description' onClick={() => addDescription(index)}>Add Description</button>
                        <button type='button' className='rbutton' onClick={() => removeExperience(index)}>Remove Experience</button>
                        <h3>{exp.company} <span>{updateDatesString(exp)}</span></h3>
                    </div>
                </div>
            ))}

            {/* Add New Experience Button */}
            <div className="nav-buttons">
                <button type='button' className="add-experience" onClick={addExperience}>Add Experience</button>
            </div>
        </div>
    );
};

export default Step2;
