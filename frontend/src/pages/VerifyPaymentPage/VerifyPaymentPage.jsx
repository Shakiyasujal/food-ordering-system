import React, { useState, useEffect } from 'react'
import { useCart } from '../../CartContext/CartContext'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const VerifyPaymentPage = () => {
    const { clearCart } = useCart()
    const { search } = useLocation()
    const navigate = useNavigate()
    const [statusMsg, setStatusMsg] = useState('Verifying payment...')

    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(search)
            const success = params.get('success')
            const session_id = params.get('session_id')

            const token = localStorage.getItem('authToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}

            // Payment canceled or session_id missing
            if (success !== 'true' || !session_id) {
                if (success === 'false') {
                    navigate('/checkout', { replace: true })
                    return
                }
                setStatusMsg('Payment failed or incomplete.')
                return
            }

            try {
                await axios.get('https://food-ordering-system-backend-0o7i.onrender.com/api/orders/confirm', {
                    params: { session_id },
                    headers
                })
                clearCart()
                navigate('/myorder', { replace: true })
            } catch (error) {
                console.error('Payment confirmation error:', error)
                setStatusMsg('Payment confirmed but failed to verify with server.')
                clearCart(false)
            }
        }

        verifyPayment()
    }, [search, navigate, clearCart])

    return (
        <div className='min-h-screen flex items-center justify-center text-amber-400 bg-[#1a120b]'>
            <p className='text-xl font-semibold'>{statusMsg}</p>
        </div>
    )
}

export default VerifyPaymentPage
