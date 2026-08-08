/**
 * Developer: Mahmoud Sameh Fathy Ibrahim
 * Code / Student ID: 624018
 * 
 * Description: Login Component with mandatory Email Verification check using Firebase Auth.
 */

import React, { useState, useContext, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { BiErrorCircle } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { auth } from '../../firebase';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';
import { LanguageContext } from '../../components/context/LanguageContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { user, loginWithGoogle } = useContext(UserContext) || {};
    const { showToast } = useContext(ToastContext) || {};
    const { t } = useContext(LanguageContext) || { t: (key) => key };
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setError('');
        setIsLoading(true);
        try {
            await loginWithGoogle();
            if (showToast) {
                showToast("Welcome back! Signed in with Google 🚀", 'success');
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

        if (!email.includes('@') || password.length < 6) {
            setError('Please enter a valid email and a password with at least 6 characters.');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Sign in using signInWithEmailAndPassword
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedUser = userCredential.user;

            // 2. Check user.emailVerified status
            if (!loggedUser.emailVerified) {
                // If false: signOut immediately and show error requiring email verification
                await signOut(auth);
                setIsLoading(false);
                setError("Your email address is not verified yet. Please check your inbox and verify your email before logging in.");
                return;
            }

            // 3. If true: allow login and navigate to home/dashboard
            if (showToast) {
                showToast(`Welcome back, ${loggedUser.displayName || 'Customer'}! 👋`, 'success');
            }
            setIsLoading(false);
            navigate('/', { replace: true });

        } catch (err) {
            setIsLoading(false);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                setError("We couldn't find an account matching these credentials.");
            } else if (err.code === 'auth/wrong-password') {
                setError("Incorrect password. Please try again.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError(err.message || "Failed to log in. Please check your connection.");
            }
        }
    };

    return (
        <div className='login_page'>
            <div className="login_container">
                <div className="login_header">
                    <div className="login_icon_wrap">
                        <FaSignInAlt />
                    </div>
                    <h2>{t('signIn') || 'Welcome Back'}</h2>
                    <p className="login_subtitle">{t('loginTitle') || 'Sign in to your account to continue'}</p>
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
                        <label htmlFor="email">{t('emailText') || 'Email Address'}</label>
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
                        <label htmlFor="password">{t('passwordLabel') || 'Password'}</label>
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
                        <div style={{ textAlign: 'right', marginTop: '6px' }}>
                            <Link to="/forgot-password" style={{ color: '#0090f0', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                                {t('forgotPassword')}
                            </Link>
                        </div>
                    </div>
                    <button type="submit" className="login_btn" disabled={isLoading}>
                        {isLoading ? <span className="btn_spinner"></span> : (t('signIn') || 'Sign In')}
                    </button>

                    <div className="social_divider">
                        <span>OR</span>
                    </div>

                    <button type="button" className="google_auth_btn" onClick={handleGoogleSignIn} disabled={isLoading}>
                        <FcGoogle className="google_icon" />
                        <span>Continue with Google</span>
                    </button>

                    <p className="register_link">
                        {t('dontHaveAccount') || "Don't have an account?"} <Link to="/signup">{t('signUp') || 'Sign up here'}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
