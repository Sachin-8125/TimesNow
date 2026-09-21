import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useState,
    useMemo,
} from 'react';
import { api, setAccessToken } from '../lib/api';

const AuthContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components -- context + hook colocated by design
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

function applyAuthPayload(payload, setUser, setToken) {
    const token = payload?.accessToken ?? null;
    const user = payload?.user ?? null;
    setAccessToken(token);
    setUser(user);
    setToken(token);
}

function clearAuth(setUser, setToken) {
    setAccessToken(null);
    setUser(null);
    setToken(null);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setToken] = useState(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            const response = await api.post('/auth/refresh');
            applyAuthPayload(response.data, setUser, setToken);
            return response.data;
        } catch (error) {
            clearAuth(setUser, setToken);
            throw error;
        }
    }, []);

    const login = useCallback(async (values) => {
        try {
            const response = await api.post('/auth/login', values);
            applyAuthPayload(response.data, setUser, setToken);
            return response.data;
        } catch (error) {
            clearAuth(setUser, setToken);
            throw error;
        }
    }, []);

    const register = useCallback(async (values) => {
        try {
            const response = await api.post('/auth/register', values);
            applyAuthPayload(response.data, setUser, setToken);
            return response.data;
        } catch (error) {
            clearAuth(setUser, setToken);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            clearAuth(setUser, setToken);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        async function bootstrap() {
            try {
                await refreshSession();
            } catch {
                // Session bootstrap error handled silently for initial unauthenticated state
            } finally {
                if (mounted) {
                    setIsBootstrapping(false);
                }
            }
        }

        bootstrap();

        return () => {
            mounted = false;
        };
    }, [refreshSession]);

    const value = useMemo(
        () => ({
            user,
            accessToken,
            isAuthenticated: Boolean(user),
            isBootstrapping,
            login,
            register,
            logout,
            refreshSession,
        }),
        [accessToken, isBootstrapping, login, logout, refreshSession, register, user]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}