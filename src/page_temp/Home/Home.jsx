import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-content">
                    {/* Barreeffama simannaa image_b2f7a1.png fakkaatu */}
                    <h1 className="moving-welcome">WELCOME TO BEEBBOO BURGER</h1>

                    <h1 className="animate-up">
                        Nyaata Qulqulluu, <br />
                        <span>BEEBBOO BURGER!</span>
                    </h1>

                    <p className="animate-up">
                        Discover the best burger experience in Addis Ababa,
                        crafted with precision and premium ingredients.
                    </p>

                    <div className="hero-btns animate-up">
                        <Link to="/menu" className="btn btn-primary">ORDER NOW</Link>
                        <Link to="/about" className="btn btn-secondary">ABOUT US</Link>
                    </div>
                </div>

                <div className="hero-image-container">
                    <div className="blob-frame">
                        <img
                            src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop"
                            alt="Burger"
                            className="floating-burger"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;