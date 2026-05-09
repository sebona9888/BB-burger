import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="logo-text">Beebboo <span>Burger</span></h2>
                    <p>
                        Burger mi'aawaa fi qulqulluu Finfineef  nannoo ishee keessatti aragchuu dandeessu .
                        Dhandhama addaa fi tajaajila ariifataa!
                    </p>
                </div>

                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>Home</li>
                        <li>Menu</li>
                        <li>About Us</li>
                        <li>Contuct us</li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>📍 Addis Ababa, Ethiopia</p>
                    <p>📞 +251 92386748</p>
                    <p>📧 beebbooburger@gmail.com</p>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; 2026 Beebboo Burger | Designed by  SEBONA HAILE 
            </div>
        </footer>
    );
};

export default Footer;