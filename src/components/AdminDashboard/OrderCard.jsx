import React from 'react';

const OrderCard = ({ order, onStatusChange }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return '⏳ Pending';
            case 'Processing': return '🔄 Processing';
            case 'Delivered': return '✅ Delivered';
            case 'Cancelled': return '❌ Cancelled';
            default: return status;
        }
    };

    return (
        <div className="order-card">
            <div className="order-info">
                <strong>{order.fullName}</strong>
                <p>📧 Email: {order.email || 'No email provided'}</p>
                <p>📞 {order.phone} | 📍 {order.address}</p>
                <p>💰 Total: {order.totalPrice} ETB | 💳 {order.paymentMethod}</p>
                <p>Status: <span className={`status-${order.status.toLowerCase()}`}>{getStatusBadge(order.status)}</span></p>
            </div>
            {order.screenshot && (
                <a href={order.screenshot} target="_blank" rel="noopener noreferrer" className="screenshot-link">
                    📸 View Payment
                </a>
            )}
            <div className="order-items">
                {order.items?.map((item, idx) => (
                    <div key={idx} className="item-row">🍔 {item.name} (x{item.quantity})</div>
                ))}
            </div>
            <select
                value={order.status}
                onChange={(e) => onStatusChange(order._id, e.target.value)}
                className="status-select"
            >
                <option>Pending</option>
                <option>Processing</option>
                <option>Delivered</option>
                <option>Cancelled</option>
            </select>
        </div>
    );
};

export default OrderCard;