import React from 'react';
import './CategoryFilter.css';

const categories = ["All", "Beef", "Chicken", "Veggie", "Drinks"];

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
    return (
        <div className="category-filter">
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;