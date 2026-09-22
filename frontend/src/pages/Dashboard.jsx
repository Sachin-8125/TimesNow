import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } finally {
            navigate('/signin', { replace: true });
        }
    }

    return (
        <div className="centered-card">
            <h1>Dashboard</h1>
            {user ? (
                <p>Signed in as {user.email ?? user.name ?? 'unknown user'}</p>
            ) : (
                <p>Signed in</p>
            )}
            <button type="button" onClick={handleLogout}>
                Log out
            </button>
        </div>
    );
}
