import { useState } from 'react';

const SearchFilter = ({ onSearch }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ name, category, maxPrice });
    };

    return (
        <form onSubmit={handleSearch} className="search-filter">
            <div className="input-group">
                <label>Name</label>
                <input 
                    type="text" 
                    placeholder="e.g., Chocolate" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                />
            </div>
            <div className="input-group">
                <label>Category</label>
                <input 
                    type="text" 
                    placeholder="e.g., Candy" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                />
            </div>
            <div className="input-group">
                <label>Max Price</label>
                <input 
                    type="number" 
                    placeholder="e.g., 5" 
                    value={maxPrice} 
                    onChange={e => setMaxPrice(e.target.value)} 
                />
            </div>
            <button type="submit" className="button--primary">Search</button>
        </form>
    );
};

export default SearchFilter;