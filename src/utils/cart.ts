import type { Product } from "../components/ProductCard";

export type CartItem = {
  product: Product;
  quantity: number;
};

const CART_KEY = "yoju_cart";

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existingItem = cart.find(
    (item) => item.product.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function updateCartQuantity(
  productId: number,
  quantity: number
): void {
  const cart = getCart()
    .map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    )
    .filter((item) => item.quantity > 0);

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeFromCart(productId: number): void {
  const cart = getCart().filter(
    (item) => item.product.id !== productId
  );

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}