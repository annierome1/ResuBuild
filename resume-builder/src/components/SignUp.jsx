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
            console.log('🚀 Sending sign-up request...');

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            console.log('📨 Response received:', response);

            const data = await response.json();

            if (response.ok) {
                console.log('✅ Sign-up successful:', data);

                setErrorMessage('');
                setSuccessMessage('Account created successfully! Logging you in...');

                // Automatically log in the user after sign-up
                await loginUserAfterSignup(username, password);
            } else {
                console.error('❌ Sign-up failed:', data);
                setErrorMessage(data.error || 'Failed to create account.');
            }
        } catch (error) {
            console.error('❌ Error during sign-up:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    // Function to log the user in immediately after signing up
    const loginUserAfterSignup = async (username, password) => {
        try {
            console.log('🔑 Attempting to log in automatically...');

            const loginResponse = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                console.log('✅ Auto-login successful:', loginData);
                
                // Call the success callback with token & username
                onSignUpSuccess(loginData.token, username);
            } else {
                console.error('❌ Auto-login failed:', loginData);
                setErrorMessage('Sign-up successful, but auto-login failed. Please log in manually.');
            }
        } catch (error) {
            console.error('❌ Error during auto-login:', error);
            setErrorMessage('Sign-up successful, but auto-login failed. Please log in manually.');
        }
    };

    return (
        <div>
            
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
