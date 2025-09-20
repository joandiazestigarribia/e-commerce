import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { toggleCart } from '@/store/slices/cartSlice';

export const Header = () => {
    const { itemCount } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();
    const handleToggleCart = () => {
        dispatch(toggleCart());
    }

    return (
        <header className="bg-white border-b border-gray-200 fixed w-full z-[998]">
            <div className="w-[90%] mx-auto py-[15px]">
                <div className="flex justify-between items-center h-[35px] text-[11px]">
                    <nav className="flex items-center">
                        <button className="text-gray-600 hover:text-gray-900 mr-[15px]">
                            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link to="/shop" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            SHOP
                        </Link>
                        <Link to="/collection" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            COLLECTION
                        </Link>
                        <Link to="/profile" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            PROFILE
                        </Link>
                        <Link to="/journal" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide">
                            JOURNAL
                        </Link>
                    </nav>


                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/" className="text-[16px] font-light text-gray-900 tracking-[2px]">
                            ZULU & ZEPHYR
                        </Link>
                    </div>


                    <nav className="flex items-center">
                        <Link to="/shop" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            SHOP
                        </Link>
                        <Link to="/instagram" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            INSTAGRAM
                        </Link>
                        <Link to="/stockists" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            STOCKISTS
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            CONTACT
                        </Link>
                        <Link to="/blog" className="text-gray-600 hover:text-gray-900 font-medium tracking-wide mr-[15px]">
                            BLOG
                        </Link>
                        <button
                            onClick={handleToggleCart}
                            className="text-gray-600 hover:text-gray-900 relative"
                        >
                            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};