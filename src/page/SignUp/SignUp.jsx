import React, { useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import { BiErrorCircle } from "react-icons/bi";

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match. Please type them carefully.");
            return;
        }

        if (password.length < 6) {
            setError("Password is too weak. Please use at least 6 characters.");
            return;
        }

        console.log('Sign up attempt with:', name, email, password);
    };

    return (
        <div className='signup_page'>
            <div className="signup_container">
                <h2>Create an Account</h2>

                {error && (
                    <div className="beautiful_error_box">
                        <BiErrorCircle className="error_icon" />
                        <div className="error_content">
                            <h4>Oops! Sign Up Error</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='signup_form'>
                    <div className="form_group">
                        <label htmlFor="name">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Enter your full name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form_group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form_group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Create a password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form_group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            placeholder="Confirm your password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="signup_btn">Sign Up</button>
                    <p className="login_link">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
