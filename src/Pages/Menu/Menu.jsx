import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import './Menu.css';

const Menu = () => {
    const [burgers, setBurgers] = useState([]);
    const [filteredBurgers, setFilteredBurgers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBurger, setSelectedBurger] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortBy, setSortBy] = useState("default"); // ✅ ADDED: Sort by price

    const cart = useContext(CartContext);
    const addToCartFunction = cart?.addToCart;

    const handleAddToCart = (burger) => {
        if (addToCartFunction) {
            addToCartFunction(burger);
            toast.success(`${burger.name} korbootti dabalameera! 🍔`, {
                position: "bottom-center", // ✅ Changed from top to bottom-center
                duration: 2000,
            });
        } else {
            toast.error("Hojiin kun hin milkoofne");
        }
    };

    useEffect(() => {
        const fetchBurgers = async () => {
            try {
                const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');
                setBurgers(res.data);
                setFilteredBurgers(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Menu fiduu irratti dogoggorri uumame", {
                    position: "bottom-center",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchBurgers();
    }, []);

    // ✅ ADDED: Sort logic
    useEffect(() => {
        let result = [...burgers];

        // Filter by category
        if (activeCategory !== "All") {
            result = result.filter(b => b.category === activeCategory);
        }

        // Filter by search
        if (searchTerm) {
            result = result.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Sort by price
        if (sortBy === "priceAsc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceDesc") {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredBurgers(result);
    }, [searchTerm, activeCategory, burgers, sortBy]);

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <section className="menu-section">
            <div className="menu-container">
                <h1 className="menu-title">Menu <span>Beebboo</span></h1>

                <div className="filter-controls">
                    <input
                        type="text"
                        placeholder="Search burger..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* ✅ ADDED: Sort by price dropdown */}
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="default">Default</option>
                        <option value="priceAsc">Price: Low to High ↑</option>
                        <option value="priceDesc">Price: High to Low ↓</option>
                    </select>

                    <div className="category-tabs">
                        {["All", "Beef", "Chicken", "Vegan", "Special"].map(cat => (
                            <button
                                key={cat}
                                className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="menu-grid">
                    {filteredBurgers.map(item => (
                        <div key={item._id} className="menu-card" onClick={() => setSelectedBurger(item)}>
                            <div className="badge-fresh">New</div>
                            <div className="menu-img-box">
                                <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                            </div>
                            <div className="menu-info">
                                <h3>{item.name}</h3>
                                <p className="menu-desc">{item.description || "Delicious burger"}</p>
                                <div className="menu-footer">
                                    <span className="price">{item.price} ETB</span>
                                    <button className="view-btn">View</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedBurger && (
                <div className="modal-overlay" onClick={() => setSelectedBurger(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedBurger(null)}>&times;</button>
                        <div className="modal-body">
                            <img src={selectedBurger.image || '/placeholder.jpg'} alt={selectedBurger.name} />
                            <div className="modal-details">
                                <h2>{selectedBurger.name}</h2>
                                <p>{selectedBurger.description}</p>
                                <span className="modal-price">{selectedBurger.price} ETB</span>
                                <button className="add-btn-large" onClick={() => {
                                    handleAddToCart(selectedBurger);
                                    setSelectedBurger(null);
                                }}>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Menu;