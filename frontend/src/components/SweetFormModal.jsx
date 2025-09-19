import { useState, useEffect } from 'react';

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
};

const modalContentStyle = {
    background: 'white', padding: '2rem', borderRadius: '8px', width: '400px'
};

const SweetFormModal = ({ sweet, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', quantity: ''
    });

    // If a sweet is passed, it's an edit; otherwise, it's a new sweet.
    const isEditing = !!sweet;

    useEffect(() => {
        if (isEditing) {
            setFormData(sweet);
        }
    }, [sweet, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>{isEditing ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Category:</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Price:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Quantity:</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onCancel}>Cancel</button>
                        <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white' }}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SweetFormModal;