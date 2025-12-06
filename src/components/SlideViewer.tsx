import React, { useState } from 'react';
import { GenericSlide } from './renderer/GenericSlide';
import { Theme } from '@/types/theme';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideViewerProps {
    data: any;
    theme: Theme;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
    onClose: () => void;
}

export function SlideViewer({ data, theme, profile, onClose }: SlideViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const totalSlides = data.slides.length;

    // Calculate scale to fit screen
    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            let availableWidth, availableHeight;

            if (mobile) {
                // Mobile: Full width minus LARGER padding to prevent cut-off
                // Height minus header (60) and footer controls (80) = ~140. Using 150 for safety.
                availableWidth = window.innerWidth - 20; // Reduced margin to use more width
                availableHeight = window.innerHeight - 150; // Reduced margin (was 200) to let slide be bigger
            } else {
                // Desktop: Keep original logic as requested ("perfect")
                const padding = 40;
                availableWidth = window.innerWidth - padding;
                availableHeight = window.innerHeight - 120;
            }

            const scaleX = availableWidth / 1080;
            const scaleY = availableHeight / 1350;

            // Use the smaller scale AND reduce by 5% extra safety margin
            setScale(Math.min(scaleX, scaleY, 1) * 0.95);
        };

        handleResize(); // Initial calc
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        if (currentIndex < totalSlides - 1) {
            setCurrentIndex(curr => curr + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(curr => curr - 1);
        }
    };

    return (
        <div className="viewer-overlay">
            {/* Header / Close */}
            <div className="viewer-close-container">
                <button
                    onClick={onClose}
                    className="viewer-round-btn"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="viewer-content-area">
                {/* Desktop Navigation Left */}
                {!isMobile && (
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="viewer-nav-btn prev"
                    >
                        <ChevronLeft size={40} />
                    </button>
                )}

                {/* Slide Container */}
                <div
                    className="viewer-slide-container"
                    style={{ transform: `scale(${scale})` }}
                >
                    <GenericSlide
                        id={`viewer-slide-${currentIndex}`}
                        data={data.slides[currentIndex]}
                        index={currentIndex}
                        total={totalSlides}
                        profile={profile}
                        theme={theme}
                        scale={1}
                    />
                </div>

                {/* Desktop Navigation Right */}
                {!isMobile && (
                    <button
                        onClick={nextSlide}
                        disabled={currentIndex === totalSlides - 1}
                        className="viewer-nav-btn next"
                    >
                        <ChevronRight size={40} />
                    </button>
                )}
            </div>

            {/* Mobile Controls (Bottom) */}
            {isMobile && (
                <div className="viewer-mobile-controls">
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="viewer-mobile-nav-btn"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <span className="viewer-counter-text">
                        {currentIndex + 1} / {totalSlides}
                    </span>

                    <button
                        onClick={nextSlide}
                        disabled={currentIndex === totalSlides - 1}
                        className="viewer-mobile-nav-btn"
                    >
                        <ChevronRight size={48} />
                    </button>
                </div>
            )}

            {/* Desktop Counter */}
            {!isMobile && (
                <div className="viewer-desktop-counter">
                    {currentIndex + 1} / {totalSlides}
                </div>
            )}
        </div>
    );
}
