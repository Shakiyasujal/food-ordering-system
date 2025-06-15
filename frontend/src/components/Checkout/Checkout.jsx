import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useCart } from '../../CartContext/CartContext'
import axios from 'axios'

// Reusable input component
const Input = ({ label, type = 'text', name, value, onChange }) => (
    <div>
        <label className='block mb-1 text-sm font-medium text-amber-200'>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className='w-full p-2 rounded-lg bg-[#2a1e1e] text-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400'
            required
        />
    </div>
)

const Checkout = () => {
    const { totalAmount, cartItems, clearCart } = useCart()
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phone: '',
        email: '', address: '', city: '',
        paymentMethod: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const token = localStorage.getItem('authToken')
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

    // Handle payment status on redirect
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const paymentStatus = params.get('payment_status')
        const sessionId = params.get('session_id')

        if (paymentStatus) {
            setLoading(true)

            if (paymentStatus === 'success' && sessionId) {
                axios.post('http://localhost:4000/api/orders/confirm',
                    { sessionId },
                    { headers: authHeaders })
                    .then(({ data }) => {
                        clearCart()
                        navigate('/myorder', {
                            state: { order: data.order }
                        })
                    })
                    .catch(error => {
                        console.error('Payment confirmation error:', error)
                        setError('Payment confirmation failed.')
                    })
                    .finally(() => setLoading(false))
            } else if (paymentStatus === 'cancel') {
                setError('Payment was cancelled or failed')
                setLoading(false)
            }
        }
    }, [location.search, clearCart, navigate])

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const subtotal = Number(totalAmount.toFixed(2))
        const tax = Number((subtotal * 0.05).toFixed(2))
        const payload = {
            ...formData,
            subtotal,
            tax,
            total: Number((subtotal + tax).toFixed(2)),
            items: cartItems.map(({ item, quantity }) => ({
                name: item.name,
                price: item.price,
                quantity,
                imageUrl: item.imageUrl || ''
            }))
        }

        try {
            const { data } = await axios.post(
                'http://localhost:4000/api/orders',
                payload,
                { headers: authHeaders }
            )

            if (formData.paymentMethod === 'online') {
                window.location.href = data.checkoutUrl
            } else {
                clearCart()
                navigate('/myorder', { state: { order: data.order } })
            }
        } catch (error) {
            console.error('Order submission error: ', error)
            setError(error.response?.data?.message || 'Failed to submit order')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4'>
            <div className='mx-auto max-w-4xl'>
                <Link className='flex items-center gap-2 text-amber-400 mb-8' to='/cart'>
                    <FaArrowLeft /> Back to Cart
                </Link>
                <h1 className='text-4xl font-bold text-center mb-8'>Checkout</h1>

                {error && <div className='text-red-400 mb-4 text-center'>{error}</div>}
                {loading && <div className='text-yellow-400 mb-4 text-center'>Processing...</div>}

                <form className='grid lg:grid-cols-2 gap-12' onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <div className="bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6">
                        <h2 className="text-2xl font-bold">Personal Information</h2>
                        <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                        <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} />
                        <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
                    </div>

                    {/* Payment Info */}
                    <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
                        <h2 className='text-2xl font-bold'>Payment Details</h2>

                        {/* Order Summary */}
                        <div className='space-y-4 mb-6'>
                            <h3 className='text-lg font-semibold text-amber-100'>Your Order</h3>
                            {cartItems.map(({ item, quantity }) => (
                                <div key={item._id} className='flex justify-between items-center text-sm border-b border-amber-300 pb-2'>
                                    <span>{item.name} × {quantity}</span>
                                    <span>Rs. {(item.price * quantity).toFixed(2)}</span>
                                </div>
                            ))}

                            <div className='mt-4 space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span>Subtotal:</span>
                                    <span>Rs. {totalAmount.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Tax (5%):</span>
                                    <span>Rs. {(totalAmount * 0.05).toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between font-semibold text-lg border-t border-amber-400 pt-2'>
                                    <span>Total:</span>
                                    <span>Rs. {(totalAmount * 1.05).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-amber-200'>Select Payment Method</label>
                            <select
                                name='paymentMethod'
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                className='w-full p-2 bg-[#2a1e1e] text-white border border-amber-300 rounded-lg'
                                required
                            >
                                <option value=''>-- Choose --</option>
                                <option value='cod'>Cash on Delivery</option>
                                <option value='online'>Online Payment</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition duration-200'
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Checkout
