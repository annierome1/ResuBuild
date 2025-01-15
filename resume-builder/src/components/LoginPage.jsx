import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const LoginPage = ({ onLogin }) => {
    const [isSigningUp, setIsSigningUp] = useState(false);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>{isSigningUp ? 'Sign Up' : 'Log In'}</h1>
            {isSigningUp ? (
                <SignUp onSignUpSuccess={() => setIsSigningUp(false)} />
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
