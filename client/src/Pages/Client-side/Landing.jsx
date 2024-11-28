import React from 'react'
import logo from "../../assets/Logo.png";  
import beans from "../../assets/Beans.png";
import shop from "../../assets/Shop.png";
import pastry from '../../assets/Pastry.png'
import coffee from '../../assets/Coffee.png'    


const Landing = () => {
    return (
        <div className="min-h-screen bg-white px-48 ">
            <main className="container mx-auto px-6 py-9 relative">

                {/* Circle Decorations */}
                <div className="absolute left-20 top-24 space-y-2">
                    <div className="w-3 h-3 bg-[#8B4513] rounded-full"></div>
                    <div className="w-6 h-6 bg-[#8B4513] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#8B4513] rounded-full ml-2"></div>
                    <div className="w-3 h-3 bg-[#8B4513] rounded-full ml-4"></div>
                </div>



                
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-10 items-start">
                    <div className="space-y-8">
                        
                    
                        {/* Logo and Branding */}
                        <div className="flex items-center gap-4">
                            <img
                                src={logo}
                                alt="Whisked Cafe Logo"
                                className="w-16 h-16 object-contain"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-primary">Whisked Cafe</h2>
                                <p className="text-sm text-gray-600">By Ericka</p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-4">
                            <h1 className="text-5xl font-extrabold text-[#8B4513] leading-tight lg:text-6xl mt-20">
                                Great coffee meets smart management.
                            </h1>
                            <p className="text-lg text-gray-600 max-w-md">
                                Each sip of rich espresso and every sweet treat invites them to indulge in the simple taste
                            </p>
                            <button className="bg-[#8B4513] hover:bg-[#704012] text-white px-8 py-3 rounded-full">
                                Login
                            </button>
                        </div>
                    

                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2">

                        {/* Images */}
                        <div className='space-y-0'>
                        
                        <img
                            src={pastry}
                            alt="Pastries"
                            className="w-auto h-auto"
                        />
<img
                            src={beans}
                            alt="Coffee beans"
                            className="w-50 h-30"
                        />
                      
                        </div>
                        <div className="space-y-4">
                            <img
                                src={shop}
                                alt="Cafe interior"
                                className="w-full h-auto"
                            />
                            <img
                                src={coffee}
                                alt="Coffee"
                                className="w-full h-auto"
                            />
      
                        </div>
                    </div>
                </div>

                

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-14 mt-0">
                    <div className="bg-white border border-gray-200 shadow-lg p-3 rounded-xl text-left flex">
                        <div className="text-5xl text-[#8B4513] m-4">&#127849;</div>
                        <div>
                        <h3 className="font-semibold">Pastry</h3>
                        <p className="text-gray-500">Baked made by handmade</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-lg p-3 rounded-xl text-left flex">
                        <div className="text-5xl text-[#8B4513] m-4">&#9749;</div>
                        <div>
                        <h3 className="font-semibold  ">Coffee</h3>
                        <p className="text-gray-500">Made from spressos to lattes</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-lg p-3 rounded-xl text-left flex">
                        <div className="text-5xl text-[#8B4513] m-4">&#128021;</div>
                        <div>
                        <h3 className="font-semibold ">Pet Friendly</h3>
                        <p className="text-gray-500">Bring along your furry friends</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}



export default Landing
