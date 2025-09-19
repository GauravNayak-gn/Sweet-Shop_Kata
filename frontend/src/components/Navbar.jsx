import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__brand">
                <h2>Sweet Shop</h2>
            </Link>
            <div className="navbar__links">
                {isAuthenticated ? (
                    <>
                        <span>Hello, {user?.username || user?.email} {user?.role === 'admin' && '(Admin)'}</span>
                        <button onClick={handleLogout} className="button--secondary">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;