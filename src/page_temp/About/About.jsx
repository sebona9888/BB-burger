import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* 1. HERO SECTION */}
            <section className="about-hero">
                <div className="hero-grid">
                    <div className="hero-left">
                        <span className="top-tag">// BEEBBOO BURGER'N  BARA 2024 IRRAA KAASEETI UUMMATA ISAA TAJAAJILAA TURE</span>
                        <h1 className="bold-title">
                            BURGER.<br />
                            <span className="red-text">DHANDHAMA ADDAA KAN QABU.</span><br />
                            KABAJAAN ISINIIF DHIYYEESINA.
                        </h1>

                        <div className="premium-showcase">
                            <div className="michelin-card">
                                <div className="gold-badge">⭐⭐⭐ QULQULLINA FILATAMAA KAN QABU</div>
                                <h3>Qulqullina Sadarkaa Ol-aanaa Kan eegate</h3>
                                <p>Meeshaalee filatamaa, qophii ogummaa qabu fi dhandhama addaan kan qophaayu.</p>
                                <a href="#more" className="gold-link">Dabalata'n kanarraa baradhaa →</a>
                            </div>

                            <div className="stats-grid-premium">
                                <div className="stat-item"><h4>15k+</h4><p>Maamiltoota</p></div>
                                <div className="stat-item"><h4>30min</h4><p>Saffisaan</p></div>
                                <div className="stat-item"><h4>100%</h4><p>Uumamaa</p></div>
                                <div className="stat-item"><h4>4.9</h4><p>Rating</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="red-splash"></div>
                        <img
                            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"
                            alt="Beebboo Burger"
                            className="pop-image"
                        />
                        <div className="floating-delivery">
                            <span><span>🛵</span> DELIVERY BILISAA Isin qaqabsiifina</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. OUR STORY SECTION */}
            <section className="our-story-section">
                <div className="story-grid">
                    <div className="story-content">
                        <span className="top-tag">Seenaa Keenya</span>
                        <h2>Maaliif Beebboo Burger?</h2>
                        <p className="story-p">
                            Beebboo Burger kan eegalame dhandhama burger dhugaa Addis Ababa keessatti dhabame deebisuuf.
                            Guyyaa jalqabaa irraa kaasee, mul'anni keenya qulqullina foonii fi dhandhama aadaa walitti fiduudha.
                        </p>

                        <div className="vision-mission-cards">
                            <div className="mini-card">
                                <h4>Mul'ata Keenya</h4>
                                <p>Dhandhama sadarkaa addunyaa hundaaf dhiyeessuu.</p>
                            </div>
                            <div className="mini-card">
                                <h4>Kaayyo Keenya</h4>
                                <p>Qulqullina qofa osoo hin taane, jaalalaan tajaajiluu.</p>
                            </div>
                        </div>
                    </div>
                    <div className="story-visual">
                        <img
                            src="https://tccewaslmsezbqicosct.supabase.co/storage/v1/object/public/images/burger.jpg"
                            alt="Fresh ingredients"
                            className="story-img"
                        />
                        <div className="experience-tag">
                            <strong>2+</strong>
                            <span>Waggaa Muuxannoo</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CORE VALUES SECTION */}
            <section className="core-values">
                <div className="value-item">
                    <div className="value-icon">🥗</div>
                    <h3>Qulqulluu</h3>
                    <p>Meeshaalee uumamaa qofa fayyadamna.</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">🤝</div>
                    <h3>Amanamummaa</h3>
                    <p>Maamiltoota keenyaaf kabaja olaanaa qabna.</p>
                </div>
                <div className="value-item">
                    <div className="value-icon">⚡</div>
                    <h3>Saffisa</h3>
                    <p>Yeroo keessan ni kabajna.</p>
                </div>
            </section>

            {/* 4. TEAM SECTION (NEW) */}
            <section className="team-section">
                <div className="section-title">
                    <span className="top-tag">Ogummaa Keenya</span>
                    <h2>Warra Dhandhama Uuman</h2>
                </div>
                <div className="team-grid">
                    <div className="team-card">
                        <div className="chef-img-wrapper">
                            <img src="https://fkiqubgtnczwpemqvjuf.supabase.co/storage/v1/object/public/beebboo/beebboo.jpg
                        " />
                        </div>
                        <h4>beebboo beyana</h4>
                        <p>Founder & Head Chef</p>
                    </div>
                    <div className="team-card">
                        <div className="chef-img-wrapper">
                            <img src="https://fkiqubgtnczwpemqvjuf.supabase.co/storage/v1/object/public/beebboo/bur%20workers.jpg     " alt="Chef Team" />
                        </div>
                        <h4>Expert Team</h4>
                        <p>Burger Specialist</p>
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIALS (NEW) */}
            <section className="testimonials">
                <div className="test-container">
                    <div className="quote-icon">"</div>
                    <p className="test-text">
                        "Beebboo Burger ergan dhandhamee booda burger biraa nyaachuu dhaabeera. Saffisni isaanii fi qulqullinni foonii adduma!"
                    </p>
                    <div className="test-author">
                        <strong>– Ayansa Abdisa</strong>
                        <span>Barataa university finfinnee </span>
                    </div>
                </div>
            </section>

            {/* 6. NEWSLETTER (NEW) */}
            <section className="newsletter-section">
                <div className="newsletter-card">
                    <h3>Maaliif Maamila Keenya Hin Taatan?</h3>
                    <p>Beeksisa haaraa fi kaffaltii hir'ifamaa argachuuf miseensa ta'aa.</p>
                    <div className="input-group">
                        <input type="email" placeholder="Email keessan galchaa..." />
                        <button className="join-btn">Miseensa Ta'i</button>
                    </div>
                </div>
            </section>

            {/* 7. BOTTOM SERVICES */}
            <section className="bottom-services">
                <div className="s-card">
                    <div className="num">01</div>
                    <h3>GEESSUU'N BILISAA(free deliver) for less than 5km</h3>
                    <p>Ajaja Qar. 250 oliif, kaffaltii malee isin biran geessina.</p>
                </div>
                <div className="s-card dark">
                    <div className="num">02</div>
                    <h3>FOON FILATAMAA</h3>
                    <p>Foon loonii qulqulluu guyyaa guyyaan kan qophaa'u.</p>
                </div>
            </section>
        </div>
    );
};

export default About;