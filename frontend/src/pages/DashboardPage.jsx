import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import SweetCard from '../components/SweetCard';
import SearchFilter from '../components/SearchFilter';

const dashboardStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
};

const DashboardPage = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useState({});

    const fetchSweets = useCallback(async () => {
        try {
            setLoading(true);
            // Use the search endpoint with our params
            const response = await api.get('/sweets/search', { params: searchParams });
            setSweets(response.data);
        } catch (err) {
            setError('Failed to fetch sweets.');
        } finally {
            setLoading(false);
        }
    }, [searchParams]); // Re-run only when searchParams change

    useEffect(() => {
        fetchSweets();
    }, [fetchSweets]);

    const handlePurchase = (sweetId) => {
        setSweets(prevSweets =>
            prevSweets.map(sweet =>
                sweet.id === sweetId ? { ...sweet, quantity: sweet.quantity - 1 } : sweet
            )
        );
    };


   const handleSearch = (params) => {
        // Filter out empty strings from the params object
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== '')
        );
        setSearchParams(filteredParams);
    };

    const handleDelete = (sweetId) => {
        setSweets(prevSweets => prevSweets.filter(sweet => sweet.id !== sweetId));
    };

    if (loading) return <p>Loading sweets...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Our Sweets</h2>
            <SearchFilter onSearch={handleSearch} />
            <div style={dashboardStyle}>
                {sweets.length > 0 ? (
                    sweets.map(sweet => (
                        <SweetCard
                            key={sweet.id}
                            sweet={sweet}
                            onPurchase={handlePurchase}
                            onDelete={handleDelete} // Pass the delete handler
                        />
                    ))
                ) : (
                    <p>No sweets found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;