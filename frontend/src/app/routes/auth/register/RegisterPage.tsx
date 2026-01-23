import { useState } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-[90%] max-w-[450px] mx-auto py-[60px]">
                <div className="text-center mb-[40px]">
                    <h2 className="text-[14px] font-medium text-gray-900 tracking-[2px] uppercase">
                        Crear Cuenta
                    </h2>
                    <p className="mt-[10px] text-[11px] text-gray-600 font-medium tracking-wide">
                        Únete a nuestra comunidad
                    </p>
                </div>

                <form className="space-y-[20px]" onSubmit={handleSubmit}>
                    {error && (
                        <div className="border border-red-200 p-[15px]">
                            <p className="text-[11px] text-red-600 font-medium tracking-wide">{error}</p>
                        </div>
                    )}

                    <div className="space-y-[15px]">
                        <div className="grid grid-cols-2 gap-[15px]">
                            <div>
                                <label htmlFor="firstName" className="block text-[11px] font-medium text-gray-600 tracking-wide mb-[8px]">
                                    NOMBRE
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full px-[15px] py-[12px] border border-gray-200 text-[11px] text-gray-900 placeholder-gray-400 tracking-wide focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="Tu nombre"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-[11px] font-medium text-gray-600 tracking-wide mb-[8px]">
                                    APELLIDO
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full px-[15px] py-[12px] border border-gray-200 text-[11px] text-gray-900 placeholder-gray-400 tracking-wide focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="Tu apellido"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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
                                value={formData.email}
                                onChange={handleChange}
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
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-[11px] font-medium text-gray-600 tracking-wide mb-[8px]">
                                CONFIRMAR CONTRASEÑA
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-[15px] py-[12px] border border-gray-200 text-[11px] text-gray-900 placeholder-gray-400 tracking-wide focus:outline-none focus:border-gray-900 transition-colors"
                                placeholder="Repite tu contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-[10px]">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-[14px] bg-gray-900 text-white text-[11px] font-medium tracking-[1px] uppercase hover:bg-gray-800 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
                        </button>
                    </div>

                    <div className="text-center pt-[15px]">
                        <Link to="/login" className="text-[11px] text-gray-600 hover:text-gray-900 font-medium tracking-wide transition-colors">
                            ¿Ya tienes cuenta? INICIA SESIÓN
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};