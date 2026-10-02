"use client"; 

import Marquee from "react-fast-marquee";

const TrustedBy = () => {
    
    const BRANDS = [
        "https://dental-bueno.mx/logo.png",  
        "/safipack.png", 
        "/the-wave.png",
        "/digital.png",
        "/kiuve.png"
    ]

    return (
        <div className="flex flex-col items-center justify-center w-full gap-4 py-8 my-16">
            <h2 className="text-2xl font-bold text-center mb-4 text-white md:text-3xl">
                Fundadores y propietarios de empresas <br/> confían en nosotros.
            </h2>
            <Marquee gradient speed={80} gradientColor="#F4F4F5" autoFill>
                {BRANDS.map((brand) => (
                    <img src={brand} alt={`Brand ${BRANDS.indexOf(brand) + 1}`} className="h-6 md:h-12 mx-4" />
                ))}
            </Marquee>
        </div>
    )
}

export default TrustedBy;


