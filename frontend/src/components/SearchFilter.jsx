import { useState } from 'react';

const searchContainerStyle = {
    padding: '1rem',
    margin: '1rem auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const SearchFilter = ({ onSearch }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ name, category, maxPrice });
    };

    return (
        <form onSubmit={handleSearch} style={searchContainerStyle}>
            <div style={inputGroupStyle}>
                <label>Name</label>
                <input type="text" placeholder="e.g., Chocolate" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={inputGroupStyle}>
                <label>Category</label>
                <input type="text" placeholder="e.g., Candy" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div style={inputGroupStyle}>
                <label>Max Price</label>
                <input type="number" placeholder="e.g., 5" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchFilter;