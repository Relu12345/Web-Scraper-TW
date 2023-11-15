import React from "react"

const Navbar = () => {
    return (
        <nav className="bg-white shadow-lg p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold text-gray-800">
                    Web Scraper
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border-2 border-gray-300 bg-gray-100 h-10 w-4/5 lg:w-full xl:w-80 px-5 pr-10 rounded-full focus:outline-none focus:border-gray-500"
                    />
                </div>

                {/* Navigation Links */}
                <div className="space-x-4">
                    <h1>youremail@gmail.com</h1>
                </div>
            </div>
        </nav>
    )
}

export default Navbar