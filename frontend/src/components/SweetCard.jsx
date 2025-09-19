import api from '../services/api';
import useAuth from '../hooks/useAuth';

const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem',
    width: '250px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const SweetCard = ({ sweet, onPurchase,onDelete, onEdit   }) => {
    const { user } = useAuth(); // Get the current user
    const handlePurchaseClick = async () => {
        try {
            await api.post(`/sweets/${sweet.id}/purchase`);
            onPurchase(sweet.id); // Notify the parent component to update state
        } catch (error) {
            alert('Could not complete purchase.'); // Simple error handling
        }
    };

     const handleDeleteClick = async () => {
        if (window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
            try {
                await api.delete(`/sweets/${sweet.id}`);
                onDelete(sweet.id); // Notify parent to update the list
            } catch (error) {
                alert('Could not delete sweet.');
            }
        }
    };

    return (
        <div style={cardStyle}>
            <h3>{sweet.name}</h3>
            <p><strong>Category:</strong> {sweet.category}</p>
            <p><strong>Price:</strong> ${sweet.price}</p>
            <p><strong>In Stock:</strong> {sweet.quantity}</p>
            <button onClick={handlePurchaseClick} disabled={sweet.quantity === 0}>
                Purchase
            </button>
            {/* --- Admin Section --- */}
            {user?.role === 'admin' && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button style={{ backgroundColor: '#ff9800', color: 'white' }} onClick={onEdit}>
                        Edit
                    </button>
                    <button style={{ backgroundColor: '#f44336', color: 'white' }} onClick={handleDeleteClick}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default SweetCard;