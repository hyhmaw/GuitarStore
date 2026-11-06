
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import type { Product } from "../components/ProductCard";
import { getProducts } from "../services/productService";
import "../styles/Catalog.css";
import ProductFilters from "../components/ProductFilter";

type SortOption = "default" | "price-asc" | "price-desc";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Unable to load products. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const flagshipProducts = products
    .filter((product) => !product.isLimited)
    .slice(0, 4);

  const limitedProducts = useMemo(() => {
    const filtered = products
      .filter((product) => product.isLimited)
      .filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );

    if (sort === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, sort]);

  return (
    <main className="catalog-page">
      <section className="flagship-section">
        <h1 className="catalog-heading">FLAGSHIP MODELS</h1>

        {loading ? (
          <p className="catalog-message">Loading products...</p>
        ) : error ? (
          <p className="catalog-message">{error}</p>
        ) : flagshipProducts.length > 0 ? (
          <div className="flagship-list">
            {flagshipProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="catalog-message">No flagship models available.</p>
        )}

        <div className="catalog-more">
         <div className="catalog-more-desktop">
  MORE
  <span className="catalog-chevron" aria-hidden="true" />
</div>

          <Link className="catalog-more-mobile" to="/limited">
            MORE
            <span className="catalog-chevron" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="catalog-toolbar" aria-label="Product search and filters">
       <ProductFilters />

  <input
    className="catalog-search"
    type="search"
    placeholder="SEARCH PRODUCTS"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
  />

        <label className="catalog-sort-label">
          SORT BY
          <select
            className="catalog-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </section>

     <details className="catalog-mobile-filters">
  <summary>FILTERS</summary>
  <label>
    SORT BY
    <select
      value={sort}
      onChange={(event) => setSort(event.target.value as SortOption)}
    >
      <option value="default">Default</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
  </label>
</details>

      <section className="limited-section" id="limited">
        <h2 className="catalog-heading">LIMITED</h2>

        {loading ? (
          <p className="catalog-message">Loading products...</p>
        ) : error ? (
          <p className="catalog-message">{error}</p>
        ) : limitedProducts.length > 0 ? (
          <div className="limited-grid">
            {limitedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="catalog-message">No limited models available.</p>
        )}
      </section>
    </main>
  );
}
