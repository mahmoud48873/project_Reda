// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018

/**
 * Developer: Mahmoud Sameh Fathy Ibrahim
 * Student Code: 624018
 * 
 * Description: Forgot Password Component using Firebase Auth sendPasswordResetEmail.
 * Dynamically switches language (English default, Arabic via TopHeader toggle).
 */

import React, { useState, useContext } from 'react';
import '../Login/Login.css';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { ToastContext } from '../../components/context/ToastContext';
import { LanguageContext } from '../../components/context/LanguageContext';
import { BiErrorCircle, BiCheckCircle } from 'react-icons/bi';
import { FaKey } from 'react-icons/fa';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useContext(ToastContext) || {};
    const { t } = useContext(LanguageContext) || { t: (key) => key };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        const cleanEmail = email.trim();

        if (!cleanEmail || !cleanEmail.includes('@')) {
            setError(t('invalidEmailErr'));
            return;
        }

        setIsLoading(true);

        try {
            // Action code settings for redirecting back to login after password reset
            const actionCodeSettings = {
                url: `${window.location.origin}/login`,
                handleCodeInApp: true,
            };

            try {
                await sendPasswordResetEmail(auth, cleanEmail, actionCodeSettings);
            } catch (configErr) {
                console.warn("Retrying standard sendPasswordResetEmail fallback:", configErr);
                await sendPasswordResetEmail(auth, cleanEmail);
            }

            const msg = t('resetSuccessMsg');
            setSuccessMsg(msg);

            if (showToast) {
                showToast(msg, 'success');
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error('Password reset error details:', err);

            if (err.code === 'auth/user-not-found') {
                setError(t('emailNotFoundErr'));
            } else if (err.code === 'auth/invalid-email') {
                setError(t('invalidEmailErr'));
            } else if (err.code === 'auth/too-many-requests') {
                setError(t('tooManyRequestsErr'));
            } else {
                setError(err.message || t('resetFailedTitle'));
            }
        }
    };

    return (
        <div className="login_page">
            <div className="login_container">
                
                {/* Header */}
                <div className="login_header">
                    <div className="login_icon_wrap">
                        <FaKey />
                    </div>
                    <h2>{t('forgotPassword')}</h2>
                    <p className="login_subtitle">
                        {t('forgotPasswordDesc')}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="beautiful_error_box">
                        <BiErrorCircle className="error_icon" />
                        <div className="error_content">
                            <h4>{t('resetFailedTitle')}</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Alert */}
                {successMsg && (
                    <div className="beautiful_success_box">
                        <BiCheckCircle className="success_icon" />
                        <div className="success_content">
                            <h4>{t('checkEmailTitle')}</h4>
                            <p>{successMsg}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="login_form">
                    <div className="form_group">
                        <label htmlFor="email">{t('emailText') || 'Email Address'}</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="example@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="login_btn" disabled={isLoading}>
                        {isLoading ? <span className="btn_spinner"></span> : (t('sendResetLink') || 'Send Reset Link')}
                    </button>

                    {/* Back to Login Link */}
                    <p className="login_link">
                        {t('rememberPassword')} <Link to="/login">{t('backToLogin')}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
