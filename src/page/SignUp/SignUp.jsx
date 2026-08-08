/**
 * Developer: Mahmoud Sameh Fathy Ibrahim
 * Code / Student ID: 624018
 * 
 * Description: SignUp Component with mandatory Email Verification using Firebase Auth.
 */

import React, { useState, useContext, useEffect } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { BiErrorCircle } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { user, loginWithGoogle } = useContext(UserContext) || {};
    const { showToast } = useContext(ToastContext) || {};
    const navigate = useNavigate();

    const handleGoogleSignUp = async () => {
        setError('');
        setIsLoading(true);
        try {
            await loginWithGoogle();
            if (showToast) {
                showToast("Welcome! Signed in with Google 🚀", 'success');
            }
            navigate('/');
        } catch (err) {
            console.error("Google sign-in error:", err);
            setError(err.message || "Google Sign-In failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.emailVerified) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

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
            // 1. Create account with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const createdUser = userCredential.user;

            // Update user profile display name
            await updateProfile(createdUser, { displayName: name });

            // Save user profile to Firestore
            try {
                await setDoc(doc(db, 'users', createdUser.uid), {
                    uid: createdUser.uid,
                    name: name,
                    email: email,
                    role: 'user',
                    createdAt: new Date().toISOString()
                });
            } catch (firestoreErr) {
                console.warn("Firestore save error:", firestoreErr);
            }

            // 2. Call sendEmailVerification(user)
            await sendEmailVerification(createdUser);

            // 3. Call signOut(auth) immediately
            await signOut(auth);

            // 4. Show success toast/alert asking user to verify email
            const msg = "Account created! Please check your email inbox to verify your account before logging in.";
            setSuccessMsg(msg);
            if (showToast) {
                showToast("Verification email sent! Please check your inbox 📧", 'success');
            }
            setIsLoading(false);

            // 5. Redirect user to Login page
            setTimeout(() => {
                navigate('/login');
            }, 3000);

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

                {successMsg && (
                    <div className="beautiful_error_box" style={{ background: '#e6fffa', borderLeftColor: '#38b2ac' }}>
                        <BiErrorCircle className="error_icon" style={{ color: '#38b2ac' }} />
                        <div className="error_content">
                            <h4 style={{ color: '#2c7a7b' }}>Verify Email</h4>
                            <p style={{ color: '#234e52' }}>{successMsg}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='signup_form'>
                    <div className="form_group">
                        <label htmlFor="name">Full Name <span style={{ fontSize: '11px', color: '#64748b' }}>(Max 15)</span></label>
                        <input
                            type="text"
                            id="name"
                            maxLength={15}
                            placeholder="Enter your full name (Max 15 chars)"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, 15))}
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

                    <div className="social_divider">
                        <span>OR</span>
                    </div>

                    <button type="button" className="google_auth_btn" onClick={handleGoogleSignUp} disabled={isLoading}>
                        <FcGoogle className="google_icon" />
                        <span>Continue with Google</span>
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
