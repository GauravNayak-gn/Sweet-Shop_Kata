import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import SweetCard from '../components/SweetCard';
import SearchFilter from '../components/SearchFilter';
import useAuth from '../hooks/useAuth'; 
import SweetFormModal from '../components/SweetFormModal';

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
    const { user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null); // null for new, object for edit

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

    const handleOpenModal = (sweet = null) => {
        setEditingSweet(sweet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingSweet(null);
        setIsModalOpen(false);
    };
    
    const handleSaveSweet = async (sweetData) => {
        try {
            if (editingSweet) {
                // Update existing sweet
                const response = await api.put(`/sweets/${editingSweet.id}`, sweetData);
                setSweets(sweets.map(s => (s.id === editingSweet.id ? response.data : s)));
            } else {
                // Add new sweet
                const response = await api.post('/sweets', sweetData);
                setSweets([...sweets, response.data]);
            }
            handleCloseModal();
        } catch (err) {
            alert('Failed to save sweet.');
        }
    };

    if (loading) return <p>Loading sweets...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Our Sweets</h2>
                {user?.role === 'admin' && (
                    <button onClick={() => handleOpenModal()} style={{ backgroundColor: '#2196F3', color: 'white' }}>
                        Add New Sweet
                    </button>
                )}
            </div>
            <SearchFilter onSearch={handleSearch} />
            {isModalOpen && (
                <SweetFormModal
                    sweet={editingSweet}
                    onSave={handleSaveSweet}
                    onCancel={handleCloseModal}
                />
            )}
            <div style={dashboardStyle}>
                {/* ... map over sweets ... */}
                {sweets.map(sweet => (
                    <SweetCard
                        key={sweet.id}
                        sweet={sweet}
                        onPurchase={handlePurchase}
                        onDelete={handleDelete}
                        onEdit={() => handleOpenModal(sweet)} // Pass edit handler
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;