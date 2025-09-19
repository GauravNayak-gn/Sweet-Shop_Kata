import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import SweetCard from '../components/SweetCard';
import SearchFilter from '../components/SearchFilter';
import SweetFormModal from '../components/SweetFormModal';

const DashboardPage = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useState({});
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null);

    const fetchSweets = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/sweets/search', { params: searchParams });
            setSweets(response.data);
        } catch (err) {
            setError('Failed to fetch sweets.');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

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
                const response = await api.put(`/sweets/${editingSweet.id}`, sweetData);
                setSweets(sweets.map(s => (s.id === editingSweet.id ? response.data : s)));
            } else {
                const response = await api.post('/sweets', sweetData);
                setSweets([...sweets, response.data]);
            }
            handleCloseModal();
        } catch (err) {
            alert('Failed to save sweet.');
        }
    };

    if (loading) return <p>Loading sweets...</p>;
    if (error) return <p style={{ color: 'var(--color-red)' }}>{error}</p>;

    return (
        <div>
            <div className="dashboard-header">
                <h2>Our Sweets</h2>
                {user?.role === 'admin' && (
                    <button onClick={() => handleOpenModal()} className="button--primary">
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

            <div className="sweets-grid">
                {sweets.length > 0 ? (
                    sweets.map(sweet => (
                        <SweetCard
                            key={sweet.id}
                            sweet={sweet}
                            onPurchase={handlePurchase}
                            onDelete={handleDelete}
                            onEdit={() => handleOpenModal(sweet)}
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