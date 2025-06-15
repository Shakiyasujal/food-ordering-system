import Stripe from 'stripe'
import Order from '../models/orderModel.js'
import itemModel from '../models/itemModel.js'
import 'dotenv/config'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//create order function
export const createOrder = async (req, res) => {
    try {
        const {
            firstName, lastName, phone, email, address, city, paymentMethod, subtotal, tax, total, items
        } = req.body

        // Fixed validation logic - should be !Array.isArray(items)
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Invalid or empty items array"
            })
        }

        const orderItems = items.map(({ item, name, price, imageUrl, quantity }) => {
            const base = item || {}
            return {
                item: {
                    name: base.name || name || 'Unknown',
                    price: Number(base.price ?? price) || 0,
                    imageUrl: base.imageUrl || imageUrl || ''
                },
                quantity: Number(quantity) || 0
            }
        })

        //Default shipping cost
        const shippingCost = 0
        let newOrder

        if (paymentMethod === 'online') {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',

                line_items: orderItems.map(o => ({
                    price_data: {
                        currency: 'usd', // Fixed currency - 'rs' is not valid
                        product_data: { name: o.item.name },
                        unit_amount: Math.round(o.item.price * 100)
                    },
                    quantity: o.quantity
                })),
                customer_email: email,
                success_url: `${process.env.FRONTEND_URL}/myorder/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
                metadata: { firstName, lastName, email, phone }
            })

            newOrder = new Order({
                user: req.user._id,
                firstName, lastName, phone, email, address, city, paymentMethod,
                subtotal, // Fixed typo: was subTotal, should be subtotal
                tax, total, shipping: shippingCost, items: orderItems,
                paymentIntendId: session.payment_intent,
                sessionId: session.id,
                paymentStatus: 'pending'
            })

            await newOrder.save()
            return res.status(201).json({
                order: newOrder, checkoutUrl: session.url
            })
        }

        // if payment is done cash on delivery
        newOrder = new Order({
            user: req.user._id,
            firstName, lastName, phone, email, address, city, paymentMethod,
            subtotal, // Fixed typo: was subTotal, should be subtotal
            tax, total, shipping: shippingCost, items: orderItems,
            paymentStatus: 'succeeded'
        })

        await newOrder.save()
        for (const { item, quantity } of orderItems) {
            await itemModel.findOneAndUpdate(
                { name: item.name }, // or use item._id if stored
                { $inc: { totalSold: quantity } }
            )
        }

        return res.status(201).json({
            order: newOrder, checkoutUrl: null
        })

    } catch (error) {
        console.error('CreatedOrder Error:', error)
        res.status(500).json({
            message: 'Server Error', error: error.message
        })
    }
}

// confirm payment
export const confirmPayment = async (req, res) => {
    try {
        const { session_id } = req.query
        if (!session_id)
            return res.status(400).json({
                message: 'Session_id required'
            })
        const session = await stripe.checkout.sessions.retrieve(session_id)
        if (session.payment_status === 'paid') {
            const order = await Order.findOneAndUpdate(
                { sessionId: session_id },
                { paymentStatus: 'succeeded' },
                { new: true }
            )
            if (!order)
                return res.status(400).json({
                    message: 'Order not found'
                })
            if (order) {
                for (const { item, quantity } of order.items) {
                    await itemModel.findOneAndUpdate(
                        { name: item.name }, // or use item._id if available
                        { $inc: { totalSold: quantity } }
                    )
                }
            }

            return res.json(order)
        }

        return res.status(400).json({
            message: 'Payment not completed'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Server Error', error: error.message
        })
    }
}

// Get order
export const getOrders = async (req, res) => {
    try {
        const filter = { user: req.user._id } // order belong to only particular user
        const rawOrders = await Order.find(filter).sort({
            createdAt: -1
        }).lean()

        //format 
        const formatted = rawOrders.map(o => ({
            ...o, // Fixed typo: was ...0, should be ...o
            items: o.items.map(i => ({
                _id: i._id, // Fixed: was i.id, should be i._id
                item: i.item,
                quantity: i.quantity
            })),
            createdAt: o.createdAt,
            paymentStatus: o.paymentStatus
        }))
        res.json(formatted)
    } catch (error) {
        console.error('getOrders Error:', error)
        res.status(500).json({
            message: 'Server Error', error: error.message
        })
    }
}

// admin route get all orders
export const getAllOrders = async (req, res) => {
    try {
        const raw = await Order.find({}).sort({ createdAt: -1 }).lean()
        const formatted = raw.map(o => ({
            _id: o._id,
            user: o.user,
            firstName: o.firstName,
            lastName: o.lastName,
            email: o.email,
            phone: o.phone,
            address: o.address ?? o.shippingAddress?.address ?? '',
            city: o.city ?? o.shippingAddress?.city ?? '',


            paymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus,
            status: o.status,
            createdAt: o.createdAt,

            items: o.items.map(i => ({
                _id: i._id,
                item: i.item,
                quantity: i.quantity
            }))
        }))
        res.json(formatted)
    } catch (error) {
        console.error('getAllOrders Error:', error)
        res.status(500).json({
            message: 'Server Error', error: error.message
        })
    }
}

//update order without token for admin
export const updateAnyOrder = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        if (!updated) {
            return res.status(404).json({
                message: "Order not found"
            })
        }
        res.json(updated)
    } catch (error) {
        console.error('updateAnyOrder Error:', error)
        res.status(500).json({
            message: 'Server Error', error: error.message
        })
    }
}

// get order by id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order)
            return res.status(404).json({
                message: 'Order not found'
            })
        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({
                message: 'Access Denied'
            })
        }
        if (req.query.email && order.email !== req.query.email) {
            return res.status(403).json({
                message: 'Access Denied'
            })
        }
        res.json(order)
    } catch (error) {
        console.error('getOrderById Error:', error)
        res.status(500).json({
            message: 'Server Error', error: error.message
        })
    }
}

//update by id
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order)
            return res.status(404).json({
                message: 'Order not found'
            })
        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({
                message: 'Access Denied'
            })
        }
        if (req.body.email && order.email !== req.body.email) {
            return res.status(403).json({
                message: 'Access Denied'
            })
        }
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(updated)
    } catch (error) {
        console.error('updateOrder Error:', error) // Fixed error message
        res.status(500).json({
            message: 'Server Error', error: error.message
        })
    }
}