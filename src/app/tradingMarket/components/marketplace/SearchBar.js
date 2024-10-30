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
        className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        type="text"
        placeholder="Search produce..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
