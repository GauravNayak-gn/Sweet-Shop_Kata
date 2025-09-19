import api from '../services/api';
import useAuth from '../hooks/useAuth';

const SweetCard = ({ sweet, onPurchase, onDelete, onEdit }) => {
    const { user } = useAuth();

    const handlePurchaseClick = async () => {
        try {
            await api.post(`/sweets/${sweet.id}/purchase`);
            onPurchase(sweet.id);
        } catch (error) {
            alert('Could not complete purchase.');
        }
    };

    const handleDeleteClick = async () => {
        if (window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
            try {
                await api.delete(`/sweets/${sweet.id}`);
                onDelete(sweet.id);
            } catch (error) {
                alert('Could not delete sweet.');
            }
        }
    };

    const stockClass = sweet.quantity > 0 ? 'sweet-card__stock' : 'sweet-card__stock sweet-card__stock--out';
    const stockText = sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock';

    return (
        <div className="sweet-card">
            <div className="sweet-card__image-placeholder"></div>
            <div className="sweet-card__content">
                <h3 className="sweet-card__name">{sweet.name}</h3>
                <p className="sweet-card__details">Category: {sweet.category}</p>
                <p className="sweet-card__price">${parseFloat(sweet.price).toFixed(2)}</p>
                <p className={stockClass}>{stockText}</p>
                
                <button
                    onClick={handlePurchaseClick}
                    disabled={sweet.quantity === 0}
                    className="sweet-card__actions button--primary"
                >
                    Purchase
                </button>
                
                {user?.role === 'admin' && (
                    <div className="sweet-card__admin-actions">
                        <button className="button--admin-edit" onClick={onEdit}>
                            Edit
                        </button>
                        <button className="button--admin-delete" onClick={handleDeleteClick}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SweetCard;