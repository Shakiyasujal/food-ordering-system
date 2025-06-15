// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { FaStar, FaHeart } from 'react-icons/fa'

// const Trending = () => {
//     const [mostBoughtItem, setMostBoughtItem] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)

//     useEffect(() => {
//         const fetchMostBought = async () => {
//             try {
//                 // Fetch all orders (same endpoint you used in Order component)
//                 const response = await axios.get('http://localhost:4000/api/orders/getall', {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 })

//                 // Aggregate items to find the most bought one
//                 const itemCountMap = {}
//                 response.data.forEach(order => {
//                     order.items.forEach(({ item, quantity }) => {
//                         if (!itemCountMap[item._id]) itemCountMap[item._id] = { item, quantity: 0 }
//                         itemCountMap[item._id].quantity += quantity
//                     })
//                 })

//                 // Find max quantity item
//                 let maxItem = null
//                 let maxQuantity = 0
//                 for (const key in itemCountMap) {
//                     if (itemCountMap[key].quantity > maxQuantity) {
//                         maxQuantity = itemCountMap[key].quantity
//                         maxItem = itemCountMap[key].item
//                     }
//                 }

//                 setMostBoughtItem(maxItem)
//                 setError(null)
//             } catch (err) {
//                 setError(err.response?.data?.message || 'Failed to fetch trending item.')
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchMostBought()
//     }, [])

//     if (loading)
//         return (
//             <div className="flex items-center justify-center h-screen text-amber-400 text-xl">
//                 Loading trending item...
//             </div>
//         )

//     if (error)
//         return (
//             <div className="flex items-center justify-center h-screen text-red-400 text-xl">
//                 {error}
//             </div>
//         )

//     if (!mostBoughtItem)
//         return (
//             <div className="flex items-center justify-center h-screen text-amber-400 text-xl">
//                 No trending item found
//             </div>
//         )

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#1f1414] via-[#2a1e1e] to-[#3a2a2a] text-white py-16 px-4 font-[Poppins]">
//             <div className="max-w-4xl mx-auto">
//                 <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-[PlayFair_Display] italic">
//                     Trending Now
//                 </h1>

//                 <div className="relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-md
//           transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent hover:border-amber-500/20 before:absolute before:inset-0 hover:before:opacity-20">

//                     <div className="relative h-72 overflow-hidden">
//                         <img
//                             src={`http://localhost:4000${mostBoughtItem.imageUrl}`}
//                             alt={mostBoughtItem.name}
//                             className="w-full h-full object-cover object-center brightness-90 group-hover:brightness-110 transition-all duration-500"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
//                         <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
//                             <span className="flex items-center gap-2 text-amber-400">
//                                 <FaStar className="text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
//                                 <span className="font-bold">{mostBoughtItem.rating || 'N/A'}</span>
//                             </span>
//                             <span className="flex items-center gap-2 text-red-400">
//                                 <FaHeart className="text-xl animate-heartbeat" />
//                                 <span className="font-bold">{mostBoughtItem.hearts || 'N/A'}</span>
//                             </span>
//                         </div>
//                     </div>

//                     <div className="p-6 relative z-10">
//                         <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent font-[Playfair_Display] italic">
//                             {mostBoughtItem.name}
//                         </h3>
//                         <p className="text-gray-300 mb-5 text-sm leading-relaxed tracking-wide">
//                             {mostBoughtItem.description || 'No description available.'}
//                         </p>
//                         <div className="flex items-center justify-between gap-4">
//                             <span className="text-2xl font-bold text-amber-400 flex-1">
//                                 Rs {Number(mostBoughtItem.price).toFixed(2)}
//                             </span>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Trending
