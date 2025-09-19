import { useState, useEffect } from 'react';
import api from '../services/api';
import SweetCard from '../components/SweetCard';

const dashboardStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
};

const DashboardPage = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSweets = async () => {
            try {
                setLoading(true);
                const response = await api.get('/sweets');
                setSweets(response.data);
            } catch (err) {
                setError('Failed to fetch sweets.');
            } finally {
                setLoading(false);
            }
        };
        fetchSweets();
    }, []);

    if (loading) return <p>Loading sweets...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Our Sweets</h2>
            <div style={dashboardStyle}>
                {sweets.map(sweet => (
                    <SweetCard key={sweet.id} sweet={sweet} />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;