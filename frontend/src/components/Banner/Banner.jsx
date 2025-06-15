import React, { useState } from 'react'
import { FaDownload, FaSearch } from "react-icons/fa";
import { bannerAssets } from '../../assets/dummydata'

const Banner = () => {

    const [searchQuery, setSearchQuery] = useState('');

    const { bannerImage } = bannerAssets;

    const handleSearch = () => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    }
    return (
        <div className='relative'>
            <div className='bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white
            py-16 px-4 sm:px-8 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10' />

                <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10'>
                    {/* left content */}
                    <div className='felx-1 space-y-8 relative md:pr-8 lg:pr-19 text-center md:text-left'>
                        <h1 className='text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md'>
                            We're Here <br />
                            <span className='text-amber-400 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text'>
                                For Food & Delivery
                            </span>
                        </h1>
                        <p className='text-lg md:text:lg lg:text-xl font-playfair italic sm:text-xl text-amber-100 max-w-xl opacity-90
                        mx-auto md:mx-0'>
                            Best cooks and best delivery guys all at your service. Hot tasty food will reach you in 60 minutes.
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className='flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px]'>
                        {/* Image */}
                        <div className='relative rounded-full p-1 bg-gradient-to-br from-amber-400 via-amber-800 to-amber-400
                        shadow-2xl z-20 w-[250px] xs:w-[250px] xs:w-[300px] sm:w-[350px] h-[250px] xs:h-[250px] sm:h-[350px] mx-auto'>
                            <img src={bannerImage} alt="banner" className='rounded-full border-4 xs:border-8 border-amber-900/50
                            w-full h-full object-cover object-top' />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner
