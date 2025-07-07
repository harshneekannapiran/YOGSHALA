const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="search-bar">
    <input type="text" placeholder="Search yoga poses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
    <span className="search-icon">🔍</span>
  </div>
);

export default SearchBar;