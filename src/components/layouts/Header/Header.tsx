import { Link } from 'react-router-dom';

export const Header = () => {

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 p-[20px]">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-900">
                            E-Commerce
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/products" className="text-gray-700 hover:text-gray-900">
                            Productos
                        </Link>
                        <Link to="/categories" className="text-gray-700 hover:text-gray-900">
                            Categorías
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4 gap-[40px]">
                        <Link to="/cart" className="relative flex">
                            <span className="">Carrito</span>
                        </Link>
                        <div className="flex items-center space-x-4 gap-[20px]">
                            <Link to="/auth/login">
                                <span>
                                    Iniciar sesión
                                </span>
                            </Link>
                            <Link to="/auth/register">
                                <span>
                                    Registrarse
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};