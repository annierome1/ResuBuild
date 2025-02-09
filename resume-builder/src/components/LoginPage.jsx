import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const LoginPage = ({ onLogin }) => {
    const [isSigningUp, setIsSigningUp] = useState(false);

    // Function to handle successful sign-up and log the user in immediately
    const handleSignUpSuccess = (token, username) => {
        console.log("✅ Sign-up successful, logging in:", username);
        onLogin(token, username); // Call `onLogin` to update global state
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>{isSigningUp ? 'Sign Up' : 'Log In'}</h1>
            {isSigningUp ? (
                <SignUp onSignUpSuccess={handleSignUpSuccess} />
            ) : (
                <Login onLogin={onLogin} />
            )}
            <button
                onClick={() => setIsSigningUp((prev) => !prev)}
                style={{ marginTop: '20px' }}
            >
                {isSigningUp
                    ? 'Already have an account? Log in'
                    : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
};

export default LoginPage;
