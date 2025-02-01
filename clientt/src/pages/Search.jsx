import React, { useState } from 'react';

const Search = ({ data }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Handle input change and filter data based on query
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    // Filter data based on the query (case-insensitive)
    const filtered = data.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        style={styles.input}
      />
      {/* <div style={styles.results}>
        {filteredData.length === 0 ? (
          <p>No results found.</p>
        ) : (
          filteredData.map((item, index) => (
            <div key={index} style={styles.resultItem}>
              {item}
            </div>
          ))
        )}
      </div> */}
    </div>
  );
};

// Optional styles for the component
const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '20px',
  },
  results: {
    marginTop: '20px',
  },
  resultItem: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
};

export default Search;
