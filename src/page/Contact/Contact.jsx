import React, { useContext } from 'react';
import { LanguageContext } from '../../components/context/LanguageContext';
import './Contact.css';

function Contact() {
    const { t } = useContext(LanguageContext) || {};

    return (
        <div className='contact_page'>
            <div className="container">
                <h1 className='page_title'>{t ? t('contactUs') : 'Contact Us'}</h1>
                <div className='contact_content'>
                    <div className='contact_info'>
                        <h3>{t ? t('contactTitle') : 'Get In Touch'}</h3>
                        <p>{t ? t('footerDesc') : 'If you have any questions or need help, feel free to contact us.'}</p>
                        <ul>
                            <li><strong>{t ? t('emailText') : 'Email:'}</strong> mahmod48873@gmail.com</li>
                            <li><strong>{t ? t('phoneText') : 'Phone:'}</strong> 01280658002</li>
                            <li><strong>{t ? t('address') : 'Address:'}</strong> {t ? t('cairo') : 'Egypt'}</li>
                        </ul>
                    </div>
                    <form className='contact_form' onSubmit={(e)=> e.preventDefault()}>
                        <div className="form_group">
                            <input type="text" placeholder={t ? t('yourName') : "Your Name"} required />
                        </div>
                        <div className="form_group">
                            <input type="email" placeholder={t ? t('emailText') : "Your Email"} required />
                        </div>
                        <div className="form_group">
                            <textarea placeholder={t ? t('yourMessage') : "Your Message"} rows="5" required></textarea>
                        </div>
                        <button type="submit" className="submit_btn">{t ? t('sendMessage') : 'Send Message'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
