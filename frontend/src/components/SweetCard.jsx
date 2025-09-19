const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem',
    width: '250px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const SweetCard = ({ sweet }) => {
    return (
        <div style={cardStyle}>
            <h3>{sweet.name}</h3>
            <p><strong>Category:</strong> {sweet.category}</p>
            <p><strong>Price:</strong> ${sweet.price}</p>
            <p><strong>In Stock:</strong> {sweet.quantity}</p>
            <button disabled={sweet.quantity === 0}>
                Purchase
            </button>
        </div>
    );
};

export default SweetCard;