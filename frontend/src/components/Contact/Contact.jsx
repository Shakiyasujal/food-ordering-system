import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
    FiArrowRight, FiGlobe, FiMail, FiMapPin,
    FiMessageSquare, FiPhone
} from 'react-icons/fi'
import { contactFormFields } from '../../assets/dummydata'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', addres: '', query: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        toast.success('Your message has been submitted successfully!')
        setFormData({ name: '', phone: '', email: '', addres: '', query: '' })
    }

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    return (
        <div className="min-h-screen bg-[#1b120b] text-white py-16 px-4 sm:px-6 lg:px-8 font-[Poppins]">

            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#000',      // black background
                        color: '#fff',           // white text for contrast
                        border: '1px solid #444' // optional: subtle border
                    }
                }}
            />


            <div className="max-w-7xl mx-auto relative z-10">
                <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold mb-12">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-400">
                        Connect With Us
                    </span>
                </h1>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: FiMapPin,
                                title: 'Our Headquarter',
                                content: 'Chysal, Lalitpur',
                                border: 'border-amber-500',
                                hover: 'hover:border-amber-400',
                                bgFrom: 'from-amber-500/30',
                            },
                            {
                                icon: FiPhone,
                                title: 'Contact Number',
                                content: '+977 984149025',
                                border: 'border-green-500',
                                hover: 'hover:border-green-400',
                                bgFrom: 'from-green-500/30',
                            },
                            {
                                icon: FiMail,
                                title: 'Email Address',
                                content: 'mithomunch@gmail.com',
                                border: 'border-orange-500',
                                hover: 'hover:border-orange-400',
                                bgFrom: 'from-orange-500/30',
                            },
                        ].map(({ icon: Icon, title, content, border, hover, bgFrom }, idx) => (
                            <div
                                key={idx}
                                className={`relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border ${border} ${hover} group`}>
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r ${bgFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                                />
                                <div className="flex items-center mb-4 relative z-10">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Icon className="text-amber-400 text-2xl" />
                                    </div>
                                    <h3 className="ml-4 text-amber-100 text-xl font-semibold">{title}</h3>
                                </div>
                                <p className="pl-12 text-amber-100 text-lg font-light relative z-10">{content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {contactFormFields.map(({ label, name, type, placeholder, pattern, Icon }) => (
                                <div key={name}>
                                    <label className="block text-amber-100 text-sm font-medium mb-1">{label}</label>
                                    <div className="relative">
                                        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 text-xl" />
                                        <input
                                            type={type}
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/20 rounded-xl text-amber-50 placeholder-amber-200/60 focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
                                            placeholder={placeholder}
                                            pattern={pattern}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className="block text-amber-100 text-sm font-medium mb-1">Your Query</label>
                                <div className="relative">
                                    <FiMessageSquare className="absolute left-3 top-4 text-amber-400 text-xl" />
                                    <textarea
                                        rows="4"
                                        name="query"
                                        value={formData.query}
                                        onChange={handleChange}
                                        placeholder="Type your message here..."
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/20 rounded-xl text-amber-50 placeholder-amber-200/60 focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2">
                                <span>Submit</span>
                                <FiArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
