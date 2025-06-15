import React, { useEffect, useState } from 'react'
import { useCart } from '../../CartContext/CartContext'
import { dummyMenuData } from '../../assets/OmDD'
import { FaMinus, FaPlus } from "react-icons/fa"
import axios from 'axios'

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks']

const OurMenu = () => {
    const [activeCategory, setActiveCategory] = useState(categories[0])
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
    const [menuData, setMenuData] = useState({})

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get('https://food-ordering-system-backend-0o7i.onrender.com/api/items')
                const byCategory = res.data.reduce((acc, item) => {
                    const cat = item.category || 'Uncategorized'
                    acc[cat] = acc[cat] || []
                    acc[cat].push(item)
                    return acc
                }, {})
                setMenuData(byCategory)
            } catch (error) {
                console.error('Failed to load menu items: ', error)
            }
        }
        fetchMenu()
    }, [])

    //use id to find and update
    const getCartEntry = id => cartItems.find(ci => ci.item._id === id)
    const getQuantity = id => getCartEntry(id)?.quantity || 0

    //items to display
    const displayItems = (menuData[activeCategory] ?? []).slice(0, 12)

    return (
        <div className="min-h-screen bg-[#1b120b] text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent font-[Playfair_Display] italic mb-4">
                    Our Exquisite <span className="text-stroke-gold">Menu</span>
                    <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-amber-100/80">
                        A Symphony of Flavours
                    </span>
                </h1>

                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center mt-8 gap-4 mb-14">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 sm:px-6 py-2 rounded-full border-2 text-sm sm:text-base font-cinzel tracking-wider transition-all duration-300
                ${activeCategory === cat
                                    ? 'bg-gradient-to-r from-amber-900 to-amber-700 border-amber-700 text-white shadow-md scale-105'
                                    : 'bg-amber-900/20 border-amber-800/40 text-amber-200 hover:bg-amber-800/40 hover:scale-95'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayItems.map((item) => {
                        const cartEntry = getCartEntry(item._id)
                        const quantity = cartEntry?.quantity || 0
                        return (
                            <div
                                key={item._id}
                                className="bg-[#2a1d14]/80 border border-amber-800/40 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-amber-800/30 flex flex-col"
                            >
                                {/* Image */}
                                <div className="h-40 bg-black/10 flex items-center justify-center">
                                    <img src={item.imageUrl || item.image} alt={item.name} className="h-full object-contain" />
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-xl font-dancingscript text-amber-100 mb-1">{item.name}</h3>
                                    <p className="text-sm text-amber-100/80 mb-4 font-cinzel">{item.description}</p>

                                    {/* Price and Actions */}
                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="bg-amber-100/10 px-3 py-1 rounded-xl text-amber-300 font-semibold text-lg font-dancingscript">
                                            Rs {Number(item.price).toFixed(2)}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {quantity > 0 ? (
                                                <>
                                                    <button
                                                        onClick={() => quantity > 1 ? updateQuantity(cartEntry._id, quantity - 1) : removeFromCart(cartEntry._id)}
                                                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/60"
                                                    >
                                                        <FaMinus className="text-white text-xs" />
                                                    </button>
                                                    <span className="w-6 text-center text-white">{quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(cartEntry._id, quantity + 1)}
                                                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/60"
                                                    >
                                                        <FaPlus className="text-white text-xs" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(item, 1)}
                                                    className="px-4 py-1 rounded-full border border-amber-800/40 bg-amber-900/40 text-xs uppercase font-cinzel text-white hover:bg-amber-800/60 transition-all"
                                                >
                                                    Add To Cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OurMenu
