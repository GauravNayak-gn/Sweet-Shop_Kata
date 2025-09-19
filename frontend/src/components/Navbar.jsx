import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#333',
        color: 'white',
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        margin: '0 1rem',
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={linkStyle}>
                <h2>Sweet Shop</h2>
            </Link>
            <div>
                {isAuthenticated ? (
                    <>
                        <span>Hello, {user?.username || user?.email} {user?.role === 'admin' && '(Admin)'}</span>
                        <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={linkStyle}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;