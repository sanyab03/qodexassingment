import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const ProductPage = ({ addToCart }) => {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading product...</div>;
  if (error) return <div>Error loading product!</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-lg rounded-lg text-center">
      <img src={product.image} alt={product.title} className="w-full h-80 object-contain mb-4" />
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-lg font-semibold mb-4">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;
