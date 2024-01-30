"use client";

import { Billboard } from "@/types";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { useEffect, useState } from "react";

interface BillboardSliderProps {
    slides: Billboard[];
}

const BillboardSlider: React.FC<BillboardSliderProps> = ({
    slides
}) => {

    const [isMounted, setIsMounted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // hydration trick.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // useEffect for automatic sliding.
    useEffect(() => {
        if (isMounted) {
            const slideInterval = setInterval(() => {
                nextSlide();
            }, 6000);

            return () => clearInterval(slideInterval);
        }
    }, [isMounted, currentIndex, slides.length]);

    if (!isMounted) {
        return null;
    }


    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className='p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden relative group'>
            <div
                style={{ backgroundImage: `url(${slides[currentIndex].imageUrl})` }}
                className='rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover bg-center duration-500'
            ></div>
            {/* Left Arrow */}
            <div
                onClick={prevSlide}
                className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl
                rounded-full
                bg-white
                text-gray-600
                border
                shadow-md
                p-2
                hover:scale-110
                transition cursor-pointer'>
                <ChevronLeft size={20} />
            </div>
            {/* Right Arrow */}
            <div
                onClick={nextSlide}
                className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl 
                rounded-full
                bg-white
                text-gray-600
                border
                shadow-md
                p-2
                hover:scale-110
                transition cursor-pointer'>
                <ChevronRight size={20} />
            </div>
            <div className='flex top-4 justify-center py-2'>
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className='text-2xl cursor-pointer transition-all'
                    >
                        {currentIndex === slideIndex ? <Dot size={30} className="text-black transition-colors duration-300" /> : <Dot size={30} className="text-gray-600  transition-colors duration-300" />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BillboardSlider;