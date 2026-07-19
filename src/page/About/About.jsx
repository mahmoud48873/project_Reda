import React, { useContext } from 'react';
import { LanguageContext } from '../../components/context/LanguageContext';
import './About.css';

function About() {
    const { t } = useContext(LanguageContext) || {};

    return (
        <div className='static_page'>
            <div className="container">
                <h1 className='page_title'>{t ? t('aboutUsTitle') : 'About Us'}</h1>
                <div className='page_content'>
                    <p>{t ? t('aboutUsDesc') : 'Welcome to our brand! We are committed to providing you with the highest quality products and the best shopping experience.'}</p>
                    <p>{t ? t('footerDesc') : 'Our journey started with a simple vision: to make premium accessories and electronics accessible to everyone. Thank you for being part of our story.'}</p>
                </div>
            </div>
        </div>
    );
}

export default About;
