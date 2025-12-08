import React, { useRef, useState, useEffect } from 'react';
import { GenericSlide } from '../renderer/GenericSlide';
import { getCarouselTemplate } from '../templates/carousel';
import styles from './SlideViewer.module.css';
import { Theme } from '@/types/theme';

interface CarouselViewerProps {
    slides: any[];
    theme: Theme;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
}

export function CarouselViewer({ slides, theme, profile }: CarouselViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scale, setScale] = useState<number | null>(null);

    // Checar se existe template modular para este tema
    const ModularTemplate = getCarouselTemplate(theme);

    // Calculate scale to fit screen
    useEffect(() => {
        const handleResize = () => {
            // Base dimensions from GenericSlide
            const slideWidth = 1080;
            const slideHeight = 1350;

            // Available screen space (accounting for padding)
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Calculate max scale that fits both width and height with some margin
            const scaleX = (screenWidth * 0.95) / slideWidth;
            const scaleY = (screenHeight * 0.85) / slideHeight;

            // Use the smaller scale to ensure containment
            const newScale = Math.min(scaleX, scaleY, 1); // Cap at 1 to not upscale on huge screens
            setScale(newScale);
        };

        handleResize(); // Initial calc
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollLeft = containerRef.current.scrollLeft;
            const width = containerRef.current.clientWidth;
            const index = Math.round(scrollLeft / width);
            setCurrentIndex(index);
        }
    };

    if (scale === null) return null; // Prevent flash of unscaled content

    return (
        <>
            <div
                className={styles.carouselContainer}
                ref={containerRef}
                onScroll={handleScroll}
            >
                {slides.map((slide, index) => (
                    <div key={index} className={styles.slideWrapper}>
                        <div
                            className={styles.fixedSlideContainer}
                            style={{
                                transform: `scale(${scale})`,
                            }}
                        >
                            {/* Usa template modular se existir, senão usa GenericSlide */}
                            {ModularTemplate ? (
                                <ModularTemplate
                                    data={slide}
                                    index={index}
                                    total={slides.length}
                                    id={`view-slide-${index}`}
                                    profile={profile}
                                    theme={theme}
                                    scale={1}
                                />
                            ) : (
                                <GenericSlide
                                    data={slide}
                                    index={index}
                                    total={slides.length}
                                    id={`view-slide-${index}`}
                                    profile={profile}
                                    theme={theme}
                                    scale={1}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Indicator of Progress */}
            <div className={styles.infoOverlay}>
                {currentIndex + 1} / {slides.length}
            </div>
        </>
    );
}

