import api from "./api";

// 1. Orders hunda fiduuf
export const getOrders = () => api.get("/orders");

// 2. Order haaraa uumuuf (Screenshot waliin)
// ✅ 'orderData' as dhufe sun 'FormData' ta'uu qaba
export const createOrder = (orderData) => {
    return api.post("/orders", orderData, {
        headers: {
            "Content-Type": "multipart/form-data", // ✅ Suuraa dabarsuuf kuni murteessaa dha!
        },
    });
};

// 3. Status ykn Payment Verify gochuuf
// ✅ Object tokko simatee 'id' fi 'data' addaan baasa
export const updateOrder = ({ id, ...data }) => api.put(`/orders/${id}`, data);

// 4. Order haquuf
export const deleteOrder = (id) => api.delete(`/orders/${id}`);