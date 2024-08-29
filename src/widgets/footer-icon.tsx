'use client'

import { Icon } from "@akinon/next/components"
import { useState, useEffect } from 'react'; // Import useState and useEffect hooks

export default function FooterIcon() {
    const [scrolling, setScrolling] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Function to check if the viewport height is 120vh or more
        const handleScroll = () => {
            const scrollHeight = window.scrollY;
            const viewportHeight = window.innerHeight;
            setIsVisible(scrollHeight >= (viewportHeight * 1)); // 120vh is 1.2 times the viewport height
        };

        // Add event listener for scroll events
        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        setScrolling(true);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setTimeout(() => {
            setScrolling(false);
        }, 1000);
    };

    // Render the component only if isVisible is true
    return (
        <>
            {isVisible && (
                <div className={`fixed lg:bottom-20 bottom-6 lg:right-20 right-4 z-50 bg-[#fff] shadow-2xl shadow-primary-500 rounded-full lg:p-3 p-2 cursor-pointer ${scrolling ? 'pointer-events-none' : ''}`}>
                    <Icon name="chevron-top" size={30} className="text-[#C576AC]" onClick={scrollToTop} />
                </div>
            )}
        </>
    );
}
