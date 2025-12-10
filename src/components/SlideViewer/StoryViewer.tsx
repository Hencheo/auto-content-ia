import React, { useState, useEffect } from 'react';
import { StorySlide } from '../StorySlide';
import styles from './SlideViewer.module.css';
import { Theme } from '@/types/theme';

interface StoryViewerProps {
    slides: any[];
    theme: Theme;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
    sourceDomain?: string;
}

export function StoryViewer({ slides, theme, profile, sourceDomain }: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scale, setScale] = useState<number | null>(null);

    // Calculate scale to fit screen (9:16 aspect ratio)
    useEffect(() => {
        const handleResize = () => {
            // Story dimensions
            const slideWidth = 1080;
            const slideHeight = 1920;

            // Available screen space (accounting for padding and progress bar)
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Calculate max scale that fits both width and height with margin
            const scaleX = (screenWidth * 0.9) / slideWidth;
            const scaleY = (screenHeight * 0.85) / slideHeight;

            // Use the smaller scale to ensure containment
            const newScale = Math.min(scaleX, scaleY, 0.8); // Cap at 0.8 to not be too big
            setScale(newScale);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Navigation functions
    const goToNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Handle click on story area
    const handleStoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        // 30% left zone = previous, 70% right zone = next
        if (clickX < width * 0.3) {
            goToPrev();
        } else {
            goToNext();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrev();
            } else if (e.key === 'ArrowRight' || e.key === ' ') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, slides.length]);

    if (scale === null) return null;

    // Determine template ID based on theme
    const templateId = theme.id === 'modern-story' ? 'modern-story' : 'breaking-news';

    return (
        <div className={styles.storyContainer}>
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.progressSegment} ${index <= currentIndex ? styles.progressActive : ''}`}
                    />
                ))}
            </div>

            {/* Story Content with Click Zones */}
            <div
                className={styles.storyContent}
                onClick={handleStoryClick}
            >
                {/* Scaled Story Slide */}
                <div
                    className={styles.storySlideWrapper}
                    style={{
                        transform: `scale(${scale})`,
                    }}
                >
                    <StorySlide
                        data={slides[currentIndex]}
                        index={currentIndex}
                        total={slides.length}
                        id={`story-slide-${currentIndex}`}
                        profile={profile}
                        theme={theme}
                        templateId={templateId as 'breaking-news' | 'modern-story'}
                        scale={1}
                        sourceDomain={sourceDomain}
                    />
                </div>

                {/* Visual Touch Zone Indicators (invisible but functional) */}
                <div className={styles.touchZoneLeft} />
                <div className={styles.touchZoneRight} />
            </div>

            {/* Slide Counter */}
            <div className={styles.storyCounter}>
                {currentIndex + 1} / {slides.length}
            </div>
        </div>
    );
}
