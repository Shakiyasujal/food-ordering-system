import React, { useCallback, useContext, useEffect, useReducer, useMemo, createContext } from 'react'
import axios from 'axios'

const CartContext = createContext()

// Reducer for cart actions
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'HYDRATE_CART':
            return action.payload
        case 'ADD_ITEM': {
            const { _id, item, quantity } = action.payload
            const exists = state.find(ci => ci._id === _id)
            if (exists) {
                return state.map(ci =>
                    ci._id === _id ? { ...ci, quantity } : ci
                )
            }
            return [...state, { _id, item, quantity }]
        }

        case 'REMOVE_ITEM':
            return state.filter(ci => ci._id !== action.payload)
        case 'UPDATE_ITEM': {
            const { _id, quantity } = action.payload
            return state.map(ci => ci._id === _id ? { ...ci, quantity } : ci)
        }
        case 'CLEAR_CART':
            return []
        default:
            return state
    }
}

// Load cart from localStorage initially
const initializer = () => {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]')
    } catch {
        return []
    }
}

export const CartProvider = ({ children }) => {
    const [cartItems, dispatch] = useReducer(cartReducer, [], initializer)

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])

    // Hydrate cart from backend ONLY if data is not empty
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        axios.get('http://localhost:4000/api/cart', {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    dispatch({ type: 'HYDRATE_CART', payload: res.data })
                }
            })
            .catch(error => {
                if (error.response?.status !== 401) {
                    console.error("Cart hydration error:", error)
                }
            })
    }, [])

    // Add to cart
    const addToCart = useCallback(async (item, qty) => {
        const token = localStorage.getItem('authToken')
        const res = await axios.post(
            'http://localhost:4000/api/cart',
            { itemId: item._id, quantity: qty },
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        dispatch({ type: 'ADD_ITEM', payload: res.data })
    }, [])

    // Remove from cart
    const removeFromCart = useCallback(async (_id) => {
        const token = localStorage.getItem('authToken')
        await axios.delete(`http://localhost:4000/api/cart/${_id}`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
        })
        dispatch({ type: 'REMOVE_ITEM', payload: _id })
    }, [])

    // Update quantity
    const updateQuantity = useCallback(async (_id, qty) => {
        const token = localStorage.getItem('authToken')
        const res = await axios.put(
            `http://localhost:4000/api/cart/${_id}`,
            { quantity: qty },
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        dispatch({ type: 'UPDATE_ITEM', payload: res.data })
    }, [])

    // Clear cart
    const clearCart = useCallback(async () => {
        const token = localStorage.getItem('authToken')
        await axios.post(
            'http://localhost:4000/api/cart/clear',
            {},
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        dispatch({ type: 'CLEAR_CART' })
    }, [])

    // Derived values
    const totalItems = useMemo(() =>
        cartItems.reduce((sum, ci) => sum + (ci.quantity || 0), 0), [cartItems]
    )

    const totalAmount = useMemo(() =>
        cartItems.reduce((sum, ci) => {
            const price = ci?.item?.price ?? 0
            const qty = ci?.quantity ?? 0
            return sum + price * qty
        }, 0), [cartItems]
    )

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalAmount
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
