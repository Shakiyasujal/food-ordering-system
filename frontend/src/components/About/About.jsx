import React from 'react';
import { FaLeaf, FaUtensils, FaHeart } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#3c2a11] to-[#1a120b] text-amber-50 relative font-[Poppins] px-6 py-20 overflow-hidden">
            {/* Background particles */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-400 bg-clip-text text-transparent font-[Playfair_Display] italic drop-shadow-md">
                        Our Story of Taste & Tradition
                    </h1>
                    <p className="text-amber-200 text-base mt-4 max-w-2xl mx-auto font-cinzel tracking-wide leading-relaxed">
                        Rooted in heritage, refined with love — we serve memories plated with passion.
                    </p>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Card 1 */}
                    <div className="bg-[#3b2419] rounded-3xl p-8 text-center border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-amber-500/30">
                        <FaLeaf className="text-4xl text-yellow-300 mx-auto mb-4 animate-spin-slow" />
                        <h3 className="text-xl font-bold text-yellow-200 mb-2 font-[Playfair_Display]">
                            Farm to Fork
                        </h3>
                        <p className="text-sm text-amber-100 font-cinzel leading-relaxed">
                            We select only the finest ingredients, harvested fresh and locally sourced to bring unmatched taste and quality.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#3b2419] rounded-3xl p-8 text-center border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-amber-500/30">
                        <FaUtensils className="text-4xl text-yellow-300 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-yellow-200 mb-2 font-[Playfair_Display]">
                            Crafted with Passion
                        </h3>
                        <p className="text-sm text-amber-100 font-cinzel leading-relaxed">
                            Our chefs bring heritage recipes to life with a modern twist, ensuring every plate tells a story of flavor.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#3b2419] rounded-3xl p-8 text-center border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-amber-500/30">
                        <FaHeart className="text-4xl text-yellow-300 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-xl font-bold text-yellow-200 mb-2 font-[Playfair_Display]">
                            Made with Love
                        </h3>
                        <p className="text-sm text-amber-100 font-cinzel leading-relaxed">
                            Every bite is filled with warmth and care — because for us, food is not just a dish, it's an emotion.
                        </p>
                    </div>
                </div>

                {/* Final Note */}
                <div className="mt-20 text-center max-w-3xl mx-auto">
                    <p className="text-lg text-amber-100 font-cinzel tracking-wide leading-relaxed">
                        Whether you're here for a nostalgic bite or an adventurous flavor ride, our table is always set for you. Welcome to a place where food speaks, and hearts listen.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
