
import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import "../styles/ProductFilter.css";

const filterOptions = {
  bodyShape: ["Stratocaster", "Telecaster", "Les Paul", "SG", "Other"],
  color: ["Black", "White", "Red", "Blue", "Natural", "Sunburst"],
  availability: ["In stock", "Out of stock"],
};

export default function ProductFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  const toggleOption = (
    value: string,
    selected: string[],
    setSelected: (value: string[]) => void
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  const clearFilters = () => {
    setSelectedShapes([]);
    setSelectedColors([]);
    setSelectedAvailability([]);
    setMinPrice("");
    setMaxPrice("");
  };

  const renderOptions = (
    options: string[],
    selected: string[],
    setSelected: (value: string[]) => void
  ) => (
    <div className="filter-options">
      {options.map((option) => (
        <label className="filter-option" key={option}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggleOption(option, selected, setSelected)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );

  const renderSection = (
    title: string,
    key: string,
    content: React.ReactNode
  ) => (
    <div className="filter-section">
      <button
        className="filter-section-button"
        type="button"
        onClick={() => toggleSection(key)}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={openSections.includes(key) ? "filter-chevron open" : "filter-chevron"}
        />
      </button>

      {openSections.includes(key) && (
        <div className="filter-section-content">{content}</div>
      )}
    </div>
  );

  return (
    <div className="product-filters">
      <button
        className={`filters-toggle ${isOpen ? "active" : ""}`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal size={15} strokeWidth={1.5} />
        <span>FILTERS</span>
        <ChevronDown
          size={15}
          className={isOpen ? "filter-chevron open" : "filter-chevron"}
        />
      </button>

      {isOpen && (
        <div className="filters-dropdown">
          <div className="filters-dropdown-header">
            <span>FILTERS</span>
            <button type="button" onClick={clearFilters}>
              CLEAR ALL
            </button>
          </div>

          {renderSection(
            "PRICE",
            "price",
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                placeholder="MIN"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>—</span>
              <input
                type="number"
                min="0"
                placeholder="MAX"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          )}

          {renderSection(
            "BODY SHAPE",
            "shape",
            renderOptions(filterOptions.bodyShape, selectedShapes, setSelectedShapes)
          )}

          {renderSection(
            "COLOR",
            "color",
            renderOptions(filterOptions.color, selectedColors, setSelectedColors)
          )}

          {renderSection(
            "AVAILABILITY",
            "availability",
            renderOptions(
              filterOptions.availability,
              selectedAvailability,
              setSelectedAvailability
            )
          )}
        </div>
      )}
    </div>
  );
}
