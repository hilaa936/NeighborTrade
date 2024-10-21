// /src/components/marketplace/SearchBar.tsx
import { useState } from "react";

const SearchBar = (
  { onSearch } //:{onSearch: (searchTerm: string) => void,}
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <input
        type="text"
        placeholder="Search produce..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
