import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import './Menu.css';

const Menu = () => {

    const [burgers, setBurgers] = useState([]);
    const [filteredBurgers, setFilteredBurgers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBurger, setSelectedBurger] = useState(null);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const cart = useContext(CartContext);
    const addToCart = cart ? cart.addToCart : null;

    // FETCH BURGERS
    useEffect(() => {

        const fetchBurgers = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    'https://beebboo-backend.onrender.com/api/menu'
                );

                console.log("🍔 MENU DATA:", response.data);

                if (response.data) {

                    setBurgers(response.data);
                    setFilteredBurgers(response.data);
                    setError(null);

                }

            } catch (err) {

                console.error("❌ Error fetching burgers:", err);

                setError("Backend irraa data fiduun hin danda'amne.");

            } finally {

                setLoading(false);

            }
        };

        fetchBurgers();

    }, []);

    // FILTER LOGIC
    useEffect(() => {

        let result = burgers;

        // CATEGORY
        if (activeCategory !== "All") {

            result = result.filter(
                (b) => b.category === activeCategory
            );
        }

        // SEARCH
        if (searchTerm) {

            result = result.filter((b) =>
                b.name.toLowerCase().includes(
                    searchTerm.toLowerCase()
                )
            );
        }

        setFilteredBurgers(result);

    }, [searchTerm, activeCategory, burgers]);

    // ADD TO CART
    const handleAddToCart = (burger) => {

        if (addToCart) {

            addToCart(burger);

            alert(`${burger.name} added to cart! 🍔`);

        }

        setSelectedBurger(null);
    };

    // LOADING
    if (loading) {

        return (
            <div className="loader">
                Fe'amaa jira...
            </div>
        );
    }

    // ERROR
    if (error) {

        return (
            <div className="error-msg">
                {error}
            </div>
        );
    }

    return (

        <section className="menu-section">

            <div className="menu-container">

                <h1 className="menu-title">
                    Menu <span>Beebboo</span>
                </h1>

                {/* SEARCH & FILTER */}
                <div className="filter-controls">

                    <input
                        type="text"
                        placeholder="Burger barbaadi..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    <div className="category-tabs">

                        {[
                            "All",
                            "Beef",
                            "Chicken",
                            "Vegan",
                            "Special"
                        ].map((cat) => (

                            <button
                                key={cat}
                                className={`tab-btn ${activeCategory === cat
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() =>
                                    setActiveCategory(cat)
                                }
                            >
                                {cat}
                            </button>

                        ))}

                    </div>
                </div>

                {/* MENU GRID */}
                <div className="menu-grid">

                    {filteredBurgers.length > 0 ? (

                        filteredBurgers.map((item) => (

                            <div
                                key={item._id}
                                className="menu-card"
                                onClick={() =>
                                    setSelectedBurger(item)
                                }
                            >

                                <div className="badge-fresh">
                                    Dhandhama Haaraa
                                </div>

                                <div className="menu-img-box">

                                    <img
                                        src={
                                            item.image
                                                ? item.image
                                                : 'https://via.placeholder.com/300'
                                        }
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.src =
                                                'https://via.placeholder.com/300';
                                        }}
                                    />

                                </div>

                                <div className="menu-info">

                                    <h3>{item.name}</h3>

                                    <p className="menu-desc">
                                        ✨ {
                                            item.description ||
                                            "Mi'aa addaa qaba."
                                        }
                                    </p>

                                    <div className="menu-footer">

                                        <span className="price">
                                            {item.price} ETB
                                        </span>

                                        <button className="view-btn">
                                            Ilaali
                                        </button>

                                    </div>
                                </div>
                            </div>

                        ))

                    ) : (

                        <p className="no-results">
                            Maaloo, burger ati barbaadde hin jiru.
                        </p>

                    )}

                </div>
            </div>

            {/* MODAL */}
            {selectedBurger && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedBurger(null)
                    }
                >

                    <div
                        className="modal-content animate-pop"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="close-modal"
                            onClick={() =>
                                setSelectedBurger(null)
                            }
                        >
                            &times;
                        </button>

                        <div className="modal-body">

                            <div className="modal-img-container">

                                <img
                                    src={
                                        selectedBurger.image
                                            ? selectedBurger.image
                                            : 'https://via.placeholder.com/300'
                                    }
                                    alt={selectedBurger.name}
                                    onError={(e) => {
                                        e.target.src =
                                            'https://via.placeholder.com/300';
                                    }}
                                />

                            </div>

                            <div className="modal-details">

                                <h2>
                                    {selectedBurger.name}
                                </h2>

                                <p className="modal-category">
                                    Kategori:
                                    <span>
                                        {
                                            selectedBurger.category ||
                                            "Beef"
                                        }
                                    </span>
                                </p>

                                <div className="benefit-box">

                                    <h4>
                                        Maaliif filatama?
                                    </h4>

                                    <p>
                                        {
                                            selectedBurger.description ||
                                            "Burger kun dhandhama haaraa qaba."
                                        }
                                    </p>

                                    <ul>
                                        <li>
                                            ✅ 100% Organic Foon
                                        </li>

                                        <li>
                                            ✅ Kuduraa Haaraa
                                        </li>
                                    </ul>

                                </div>

                                <div className="modal-action">

                                    <span className="modal-price">
                                        {selectedBurger.price} ETB
                                    </span>

                                    <button
                                        className="add-btn-large"
                                        onClick={() =>
                                            handleAddToCart(selectedBurger)
                                        }
                                    >
                                        Amma Ajajadhu
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Menu;