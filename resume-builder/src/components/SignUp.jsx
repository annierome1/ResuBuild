import React, { useState } from 'react';

const SignUp = ({ onSignUpSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
    
        try {
            console.log('Sending sign-up request...');
    
            // Make the API request
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            console.log('Response received:', response);
    
            // Parse the response
            const data = await response.json();
    
            if (response.ok) {
                console.log('Sign-up successful:', data);
    
                // Set success message and clear any error
                setErrorMessage('');
                setSuccessMessage('Account created successfully! You can now log in.');
    
                // Call the success callback
                onSignUpSuccess();
            } else {
                console.error('Sign-up failed:', data);
    
                // Display error message from the backend
                setErrorMessage(data.error || 'Failed to create account.');
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
    
            // Display a generic error message for network issues
            
            setErrorMessage('An error occurred. Please try again.');
        }
    };
    
    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default SignUp;
