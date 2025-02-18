import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import './index.css';
import ProductPage from "./ProductPage";

const queryClient = new QueryClient();

const Navbar = ({ cartCount, setSearch }) => (
  <nav className="flex justify-between items-center p-4 bg-green-800 text-white">
    <Link to="/" className="text-xl font-bold">Fake Store</Link>
    <input
    type="text"
    placeholder="Search..."
    className="px-2 py-1 rounded-lg border border-gray-300 text-black w-72"
    onChange={(e) => setSearch(e.target.value)}
    />
    <div className="flex items-center gap-4">
      <button className="relative">
        <Link to="/cart">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{cartCount}</span>
          )}
        </Link>
      </button>
    </div>
  </nav>
);

const ProductListing = ({ addToCart, search }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products!</div>;

  const filteredData = data.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredData.map((product) => (
        <div key={product.id} className="rounded-lg shadow-md p-4 bg-white border border-gray-200 text-center">
          <Link to={`/product/${product.id}`}>
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-48 object-contain mb-2 cursor-pointer transform transition-transform duration-200 hover:scale-110" 
            />
          </Link>
          <h2 className="text-lg font-bold mb-1">{product.title}</h2>
          <p className="text-gray-600 mb-2 font-semibold">${product.price}</p>
          <button onClick={() => addToCart(product)} className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

const CartPage = ({ cartItems, updateQuantity, removeFromCart }) => {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Review Your Cart</h1>
      {cartItems.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border-b border-gray-200">
            <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
            <div className="flex-grow">
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-gray-600 font-semibold">${item.price}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1} className="bg-gray-300 px-3 py-1 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-300 px-3 py-1 rounded">+</button>
                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
              </div>
            </div>
          </div>
        ))
      )}
      <div className="p-4 flex justify-between items-center font-bold text-lg">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <button className="bg-green-600 text-white px-6 py-2 w-full rounded hover:bg-green-700">Pay Now</button>
    </div>
  );
};

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState('');

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} setSearch={setSearch} />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<ProductListing addToCart={addToCart} search={search} />} />
            <Route path="/cart" element={<CartPage cartItems={cartItems} updateQuantity={() => {}} removeFromCart={removeFromCart} />} />
            <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
