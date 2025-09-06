import { useAppSelector, useAppDispatch } from '@/hooks';
import { closeCart, removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';


export const CartModal = () => {
    const { items, total, isOpen/* , itemCount */ } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    if (!isOpen) return null;

    const handleRemoveItem = (id: number) => {
        dispatch(removeFromCart(id));
    }

    const handleCloseCart = () => {
        dispatch(closeCart());
    }

    const handleUpdateQuantity = (id: number, quantity: number) => {
        dispatch(updateQuantity({ id, quantity}))
    }

    const handleClearCart = () => {
        dispatch(clearCart());
    }

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleCloseCart}
            />

            {/* Modal */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 z-[999]">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-medium">CARRITO DE COMPRAS</h2>
                        <button
                            onClick={handleCloseCart}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p className="text-sm">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                ${item.price.toFixed(2)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center mt-2 space-x-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total:</span>
                                <span className="font-bold text-lg">${total.toFixed(2)}</span>
                            </div>

                            <div className="space-y-2">
                                <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                                    PROCEDER AL CHECKOUT
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
                                >
                                    VACIAR CARRITO
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
