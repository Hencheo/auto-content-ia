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
                // Height minus header (60) and footer controls (100)
                availableWidth = window.innerWidth - 40; // Increased safety margin
                availableHeight = window.innerHeight - 200; // Increased safety margin
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'center', // Mobile starts top to leave room for bottom
            padding: '1rem'
        }}>
            {/* Header / Close */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 101
            }}>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Content Area */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: isMobile ? 'calc(100% - 100px)' : '100%', // Mobile reserves space for footer
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // overflow: 'hidden', // REMOVED to prevent clipping shadows or edges
                marginTop: isMobile ? '2rem' : '0'
            }}>
                {/* Desktop Navigation Left */}
                {!isMobile && (
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            opacity: currentIndex === 0 ? 0.3 : 1,
                            cursor: currentIndex === 0 ? 'default' : 'pointer',
                            zIndex: 102,
                            padding: '1rem'
                        }}
                    >
                        <ChevronLeft size={40} />
                    </button>
                )}

                {/* Slide Container */}
                <div style={{
                    width: '1080px',
                    height: '1350px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                    flexShrink: 0
                }}>
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
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            opacity: currentIndex === totalSlides - 1 ? 0.3 : 1,
                            cursor: currentIndex === totalSlides - 1 ? 'default' : 'pointer',
                            zIndex: 102,
                            padding: '1rem'
                        }}
                    >
                        <ChevronRight size={40} />
                    </button>
                )}
            </div>

            {/* Mobile Controls (Bottom) */}
            {isMobile && (
                <div style={{
                    height: '80px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    marginTop: 'auto', // Push to bottom
                    zIndex: 102
                }}>
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            opacity: currentIndex === 0 ? 0.3 : 1,
                            cursor: currentIndex === 0 ? 'default' : 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {currentIndex + 1} / {totalSlides}
                    </span>

                    <button
                        onClick={nextSlide}
                        disabled={currentIndex === totalSlides - 1}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            opacity: currentIndex === totalSlides - 1 ? 0.3 : 1,
                            cursor: currentIndex === totalSlides - 1 ? 'default' : 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        <ChevronRight size={48} />
                    </button>
                </div>
            )}

            {/* Desktop Counter */}
            {!isMobile && (
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    zIndex: 101
                }}>
                    {currentIndex + 1} / {totalSlides}
                </div>
            )}
        </div>
    );
}
