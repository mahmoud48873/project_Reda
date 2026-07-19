import React, { useState, useContext } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { BiErrorCircle } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user, signup } = useContext(UserContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (name.trim().length < 2) {
            setError("Please enter your full name (at least 2 characters).");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match. Please type them carefully.");
            return;
        }

        if (password.length < 6) {
            setError("Password is too weak. Please use at least 6 characters.");
            return;
        }

        setIsLoading(true);

        try {
            await signup({ name, email, password });
            showToast(`Welcome to Reda Store, ${name}! 🎉`, 'success');
            setIsLoading(false);
            navigate('/', { replace: true });
        } catch (err) {
            setIsLoading(false);
            if (err.code === 'auth/email-already-in-use') {
                setError("An account with this email already exists. Please log in.");
            } else if (err.code === 'auth/invalid-email') {
                setError("Please enter a valid email address.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password is too weak. Please use at least 6 characters.");
            } else {
                setError(err.message || "Failed to create account. Please try again.");
            }
        }
    };

    return (
        <div className='signup_page'>
            <div className="signup_container">
                <div className="signup_header">
                    <div className="signup_icon_wrap">
                        <FaUserPlus />
                    </div>
                    <h2>Create Account</h2>
                    <p className="signup_subtitle">Join us and start shopping today</p>
                </div>

                {error && (
                    <div className="beautiful_error_box">
                        <BiErrorCircle className="error_icon" />
                        <div className="error_content">
                            <h4>Sign Up Error</h4>
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
                        <div className="password_wrap">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Create a password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="toggle_password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div className="form_group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password_wrap">
                            <input
                                type={showConfirm ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="toggle_password" onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="signup_btn" disabled={isLoading}>
                        {isLoading ? <span className="btn_spinner"></span> : 'Create Account'}
                    </button>
                    <p className="login_link">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
