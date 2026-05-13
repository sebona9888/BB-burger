// src/components/AdminDashboard/OrdersSection.jsx
import React from 'react';
import OrderCard from './OrderCard';

const OrdersSection = ({ orders, filteredOrders, searchName, setSearchName, onStatusChange }) => {
    return (
        <div className="orders-section">
            <div className="orders-header">
                <h3>📦 Orders ({filteredOrders.length})</h3>
                <input
                    type="text"
                    placeholder="🔍 Filter by customer name..."
                    className="order-search-input"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
            </div>

            {filteredOrders.length === 0 ? (
                <p className="no-orders">No orders found.</p>
            ) : (
                filteredOrders.map(order => (
                    <OrderCard key={order._id} order={order} onStatusChange={onStatusChange} />
                ))
            )}
        </div>
    );
};

export default OrdersSection;