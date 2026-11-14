import type { Product } from "../components/ProductCard";

const API_URL = "http://localhost:3000";

type ProductsResponse = {
  items: Product[];
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const data: ProductsResponse = await response.json();

  return data.items;
}