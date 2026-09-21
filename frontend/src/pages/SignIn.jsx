import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function SignIn() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login({ email, password });
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="centered-card">
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>
                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}
