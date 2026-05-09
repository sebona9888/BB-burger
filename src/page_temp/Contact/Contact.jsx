import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="contact-container">
                <header className="contact-header">
                    <span className="brand-label">
                        <span className="label-inner">// ESTABLISHED 2024 // BURAYU KETA</span>
                    </span>
                    
                    <h1>COMMAND THE <span className="slap-accent">FLAME</span></h1>

                    <p className="golden-lead">
                        Experience the art of the flame. Our kitchen in Burayu Keta is open
                        seven days a week, serving the finest gourmet burgers in the city.
                    </p>

                    <p className="power-text">
                        We don't just take orders; we forge <strong>gastronomic alliances</strong>.
                        Our team is ready to deliver <strong>absolute excellence</strong> for those
                        who demand more than just a meal.
                    </p>
                </header>

                <div className="contact-grid">
                    <div className="contact-visual">
                        <div className="image-slap-frame">
                            <img
                                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop"
                                alt="Beebboo Gourmet Kitchen"
                            />
                            <div className="live-status">● KITCHEN ACTIVE</div>
                        </div>

                        {/* 3D STACKED PLATES */}
                        <div className="contact-3d-stack">
                            <div className="plate-3d">
                                <div className="plate-content">
                                    <small>📍 SUPREME HEADQUARTERS</small>
                                    <h3>Burayu Keta, AA</h3>
                                    <p className="plate-tag">The Heart of the Flavor</p>
                                </div>
                            </div>
                            <div className="plate-3d">
                                <div className="plate-content">
                                    <small>📞 DIRECT COMMAND LINE</small>
                                    <a href="tel:+251923876748" className="phone-3d">0923 87 67 48</a>
                                    <p className="plate-tag">24/7 Priority Access</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-wrapper">
                        <div className="form-header">
                            <h3>INITIATE CONTACT</h3>
                            <p>Direct access to our management team.</p>
                        </div>
                        <form className="restaurant-form">
                            <div className="input-group">
                                <label>Identity</label>
                                <input type="text" placeholder="Your Name" />
                            </div>
                            <div className="input-group">
                                <label>Electronic Mail</label>
                                <input type="email" placeholder="Email Address" />
                            </div>
                            <div className="input-group">
                                <label>The Mission</label>
                                <textarea rows="4" placeholder="How can we elevate your experience?"></textarea>
                            </div>
                            <button className="restaurant-btn">
                                TRANSMIT MESSAGE <span>→</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;