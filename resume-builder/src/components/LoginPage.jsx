import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const LoginPage = ({ onLogin }) => {
    const [isSigningUp, setIsSigningUp] = useState(false);

    
    const handleSignUpSuccess = (token, username) => {
        console.log("Sign-up successful, logging in:", username);
        onLogin(token, username); 
    };

    return (
        <div style={styles.container}>
            <div style={styles.authBox}>
                <h2 style={styles.heading}>{isSigningUp ? 'Create an Account' : 'Welcome Back'}</h2>
                {isSigningUp ? (
                    <SignUp onSignUpSuccess={handleSignUpSuccess} />
                ) : (
                    <Login onLogin={onLogin} />
                )}
                {/* Toggle Button for switching between login and signup */}
                <button onClick={() => setIsSigningUp((prev) => !prev)} style={styles.toggleButton}>
                    {isSigningUp
                        ? 'Already have an account? Log in'
                        : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f7fc',
        padding: '20px',
    },
    authBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '380px',
        padding: '30px',
        backgroundColor: 'white',
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        border: '1px solid #ddd',
        transition: 'all 0.3s ease-in-out',
    },
    heading: {
        fontSize: '22px',
        marginBottom: '20px',
        fontWeight: '600',
        color: '#333',
    },
    toggleButton: {
        marginTop: '15px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline',
        fontWeight: '500',
    }
};

export default LoginPage;