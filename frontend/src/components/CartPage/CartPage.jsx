import React, { useState } from 'react'
import { useCart } from '../../CartContext/CartContext'
import { Link } from 'react-router-dom'
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa'

const API_URL = 'https://food-ordering-system-backend-0o7i.onrender.com'

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart()
    const [selectedImage, setSelectedImage] = useState(null)

    //for image url
    const buildImageUrl = (path) => {
        if (!path)
            return ''
        return path.startsWith('http') ? path : `${API_URL}/uploads/${path.replace(/^\/uploads\//, '')}`

    }

    return (
        <div className="min-h-screen bg-[#1b120b] text-white px-4 py-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-center text-amber-400 mb-12 font-[Playfair_Display] italic drop-shadow">
                    Your Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-amber-200 text-xl mb-6">Your cart is currently empty.</p>
                        <Link
                            to="/menu"
                            className="bg-amber-600 hover:bg-amber-500 px-6 py-3 rounded-full uppercase font-semibold text-sm transition-all"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {cartItems.map(({ _id, item, quantity }) => (
                                <div
                                    key={_id}
                                    className="bg-[#2a1d14]/80 border border-amber-800/30 rounded-xl shadow-md overflow-hidden flex flex-col transition hover:shadow-amber-800/40"
                                >
                                    {/* Image */}
                                    <div
                                        className="h-44 bg-black/10 cursor-pointer flex items-center justify-center"
                                        onClick={() => setSelectedImage(buildImageUrl(item.imageUrl || item.image))}
                                    >
                                        <img src={buildImageUrl(item.imageUrl || item.image)} alt={item.name} className="max-h-full object-contain" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-xl font-dancingscript text-amber-100">{item.name}</h3>
                                        <p className="text-sm text-amber-200 mt-1 mb-3 font-cinzel">Rs {Number(item.price).toFixed(2)}</p>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 mt-auto">
                                            <button
                                                onClick={() => updateQuantity(_id, Math.max(1, quantity - 1))}
                                                className="w-8 h-8 rounded-full bg-amber-900/40 hover:bg-amber-800/50 flex items-center justify-center"
                                            >
                                                <FaMinus className="text-white text-xs" />
                                            </button>
                                            <span className="text-lg text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(_id, quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-amber-900/40 hover:bg-amber-800/50 flex items-center justify-center"
                                            >
                                                <FaPlus className="text-white text-xs" />
                                            </button>
                                        </div>

                                        {/* Subtotal + Remove */}
                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={() => removeFromCart(_id)}
                                                className="text-red-300 text-xs hover:text-red-400"
                                            >
                                                Remove
                                            </button>
                                            <p className="text-amber-300 font-semibold text-sm">
                                                Subtotal: Rs {Number(item.price * quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="mt-12 border-t border-amber-800 pt-8 flex flex-col items-end">
                            <h2 className="text-2xl sm:text-3xl text-amber-300 font-bold mb-4">
                                Total: Rs {Number(totalAmount).toFixed(2)}
                            </h2>
                            <div className="flex gap-4">
                                <Link
                                    to="/menu"
                                    className="border border-amber-400 text-white px-6 py-2 rounded-full uppercase text-sm hover:bg-amber-500/20"
                                >
                                    Continue Shopping
                                </Link>
                                <Link to='/checkout' className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-2 rounded-full uppercase font-semibold">
                                    Checkout Now
                                </Link>
                            </div>
                        </div>

                    </>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative">
                        <img
                            src={selectedImage}
                            alt="Zoomed"
                            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
                        />
                        <button
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-full text-white"
                            onClick={() => setSelectedImage(null)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage
