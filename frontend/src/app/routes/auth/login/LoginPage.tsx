import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-[11px] text-gray-600 font-medium tracking-wide">CARGANDO...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-[90%] max-w-[400px] mx-auto py-[60px]">
                <div className="text-center mb-[40px]">
                    <h2 className="text-[14px] font-medium text-gray-900 tracking-[2px] uppercase">
                        Iniciar Sesión
                    </h2>
                </div>

                <form className="space-y-[20px]" onSubmit={handleSubmit}>
                    {error && (
                        <div className="border border-red-200 p-[15px]">
                            <p className="text-[11px] text-red-600 font-medium tracking-wide">{error}</p>
                        </div>
                    )}

                    <div className="space-y-[15px]">
                        <div>
                            <label htmlFor="email" className="block text-[11px] font-medium text-gray-600 tracking-wide mb-[8px]">
                                EMAIL
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-[15px] py-[12px] border border-gray-200 text-[11px] text-gray-900 placeholder-gray-400 tracking-wide focus:outline-none focus:border-gray-900 transition-colors"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-[11px] font-medium text-gray-600 tracking-wide mb-[8px]">
                                CONTRASEÑA
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-[15px] py-[12px] border border-gray-200 text-[11px] text-gray-900 placeholder-gray-400 tracking-wide focus:outline-none focus:border-gray-900 transition-colors"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-[10px]">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-[14px] bg-gray-900 text-white text-[11px] font-medium tracking-[1px] uppercase hover:bg-gray-800 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
                        </button>
                    </div>

                    <div className="text-center pt-[15px]">
                        <Link to="/register" className="text-[11px] text-gray-600 hover:text-gray-900 font-medium tracking-wide transition-colors">
                            ¿No tienes cuenta? REGÍSTRATE
                        </Link>
                    </div>
                </form>

                <div className="mt-[40px] border border-gray-200 p-[20px]">
                    <p className="text-[11px] text-gray-600 font-medium tracking-wide leading-[1.8]">
                        <span className="text-gray-900">USUARIO DE PRUEBA:</span><br />
                        Email: user@ecommerce.com<br />
                        Contraseña: password123
                    </p>
                </div>
            </div>
        </div>
    );
}