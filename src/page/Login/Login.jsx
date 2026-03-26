import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { BiErrorCircle } from "react-icons/bi";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error
        
        if (!email.includes('@') || password.length < 6) {
            setError('Please enter a valid email and a password with at least 6 characters.');
            return;
        }

        console.log('Login attempt with:', email, password);
        // Simulated success/error
        if (email !== "admin@example.com") {
            setError("We couldn't find an account matching these details. Please try again or create a new account.");
            return;
        }
    };

    return (
        <div className='login_page'>
            <div className="login_container">
                <h2>Login to Your Account</h2>
                
                {error && (
                    <div className="beautiful_error_box">
                        <BiErrorCircle className="error_icon" />
                        <div className="error_content">
                            <h4>Oops! Login Failed</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='login_form'>
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
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="login_btn">Sign In</button>
                    <p className="register_link">
                        Don't have an account? <Link to="/signup">Sign up here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
