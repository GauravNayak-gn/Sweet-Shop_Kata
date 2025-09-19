import { useState, useEffect } from 'react';

const SweetFormModal = ({ sweet, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', quantity: ''
    });

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
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditing ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Category:</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Price:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" />
                    </div>
                    <div className="input-group">
                        <label>Quantity:</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="button--secondary" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="button--primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SweetFormModal;