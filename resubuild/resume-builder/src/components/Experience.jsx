import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputItem from './inputitems';
import "./experience.css";

const Step2 = ({ userObject, handleExperienceChange, handleDescriptionChange, addExperience, addDescription, removeDescription, removeExperience }) => {
    const [suggestions, setSuggestions] = useState({}); // Initialize suggestions state

    // Function to fetch job description suggestions
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
                // Store the suggestions in state, mapping them by the index of the job experience
                const newSuggestions = { ...suggestions, [index]: data.suggestions };
                setSuggestions(newSuggestions);
            } else {
                console.error('Error fetching suggestions');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to update the display string for dates
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
                    {/* Title Input: Fetches suggestions on change */}
                    <InputItem
                        className='title'
                        onChange={(e) => {
                            handleExperienceChange(index, 'title', e.target.value);
                            getSuggestions(e.target.value, index); // Fetch suggestions on title change
                        }}
                        label='Title'
                        placeholder='Enter your job title'
                        name={`title-${index}`}
                        value={exp.title}
                    />
                    
                    {/* Company Input */}
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

                    {/* End Date Picker */}
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

                    {/* Currently Working Checkbox */}
                    <div className="currently-working">
                        <input
                            type='checkbox'
                            checked={exp.currentlyWorking}
                            onChange={(e) => handleExperienceChange(index, 'currentlyWorking', e.target.checked)}
                            id={`currentlyWorking-${index}`}
                        />
                        <label htmlFor={`currentlyWorking-${index}`}>Currently Working</label>
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

                    {/* Job Descriptions List */}
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

                    {/* Display AI Suggestions */}
                    {suggestions[index] && (
                        <div className='suggestions'>
                            <h4>Suggested Descriptions:</h4>
                            {suggestions[index].map((suggestion, i) => (
                                <p key={i}>{suggestion}</p>
                            ))}
                        </div>
                    )}

                    {/* Buttons to Add or Remove Experience */}
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
