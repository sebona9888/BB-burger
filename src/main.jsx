import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ✅ App.jsx kallaattiin akka waamu gooneera
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from "./context/CartContext";
import { Toaster } from 'react-hot-toast';
import './index.css';

// QueryClient qindaa'ina isaa waliin
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Toaster position="top-center" />
        {/* ✅ RouterProvider mannaa App fayyadamna, sababni isaas Router-riin App.jsx keessa jira */}
        <App />
      </CartProvider>
    </QueryClientProvider>
  </React.StrictMode>
);