import React, { useState, useContext } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { BiErrorCircle } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, getUser } = useContext(UserContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@') || password.length < 6) {
            setError('Please enter a valid email and a password with at least 6 characters.');
            return;
        }

        setIsLoading(true);
        await new Promise(res => setTimeout(res, 800)); // simulate network

        const existingUser = getUser(email);
        if (!existingUser) {
            setError("We couldn't find an account with this email. Please sign up first.");
            setIsLoading(false);
            return;
        }

        if (existingUser.password !== password) {
            setError("Incorrect password. Please try again.");
            setIsLoading(false);
            return;
        }

        login(existingUser);
        showToast(`Welcome back, ${existingUser.name}! 👋`, 'success');
        setIsLoading(false);
        navigate('/');
    };

    return (
        <div className='login_page'>
            <div className="login_container">
                <div className="login_header">
                    <div className="login_icon_wrap">
                        <FaSignInAlt />
                    </div>
                    <h2>Welcome Back</h2>
                    <p className="login_subtitle">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="beautiful_error_box">
                        <BiErrorCircle className="error_icon" />
                        <div className="error_content">
                            <h4>Login Failed</h4>
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
                        <div className="password_wrap">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="toggle_password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login_btn" disabled={isLoading}>
                        {isLoading ? <span className="btn_spinner"></span> : 'Sign In'}
                    </button>
                    <p className="register_link">
                        Don't have an account? <Link to="/signup">Sign up here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
