import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const redirectPath = user.role === 'admin' ? '/admin'
                : user.role === 'teacher' ? '/teacher'
                    : '/dashboard';
            navigate(redirectPath, { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            // Redirect based on user role
            const redirectPath = userData.role === 'admin' ? '/admin'
                : userData.role === 'teacher' ? '/teacher'
                    : '/dashboard';
            navigate(redirectPath, { replace: true });
        } catch (error) {
            // Error toast is already shown in AuthContext
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            placeholder="student@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-slate-600">
                    <p className="font-semibold mb-1">Demo Accounts:</p>
                    <p>Student: student@demo.com / password123</p>
                    <p>Teacher: teacher@demo.com / password123</p>
                    <p>Admin: admin@edu.nexus / password123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
