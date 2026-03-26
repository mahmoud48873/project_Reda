import React from 'react';
import './Contact.css';

function Contact() {
    return (
        <div className='contact_page'>
            <div className="container">
                <h1 className='page_title'>Contact Us</h1>
                <div className='contact_content'>
                    <div className='contact_info'>
                        <h3>Get In Touch</h3>
                        <p>If you have any questions or need help, feel free to contact us.</p>
                        <ul>
                            <li><strong>Email:</strong> mahmod48873@gmail.com</li>
                            <li><strong>Phone:</strong> 01280658002</li>
                            <li><strong>Address:</strong>  Egypt - me  </li>
                        </ul>
                    </div>
                    <form className='contact_form' onSubmit={(e)=> e.preventDefault()}>
                        <div className="form_group">
                            <input type="text" placeholder="Your Name" required />
                        </div>
                        <div className="form_group">
                            <input type="email" placeholder="Your Email" required />
                        </div>
                        <div className="form_group">
                            <textarea placeholder="Your Message" rows="5" required></textarea>
                        </div>
                        <button type="submit" className="submit_btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
