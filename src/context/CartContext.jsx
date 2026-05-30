import React, { createContext, useState, useEffect } from 'react';

// Vite Fast Refresh akka hin jeeqamneef kan dabalame
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('primeart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error parsing cart:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('prime, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const index = prevItems.findIndex(item => item._id === product._id);
            if (index !== -1) {
                const updated = [...prevItems];
                updated[index].qty += 1;
                return updated;
            }
            return [...prevItems, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, amount) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === id ? { ...item, qty: Math.max(1, item.qty + amount) } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, updateQty, removeItem, clearCart, totalPrice, cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};