import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './SlideViewer.module.css';
import { CarouselViewer } from './CarouselViewer';
import { StoryViewer } from './StoryViewer';
import { Theme } from '@/types/theme';

interface SlideViewerProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    theme: Theme;
    format: 'carousel' | 'story' | 'post';
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
}

export function SlideViewer({
    isOpen,
    onClose,
    data,
    theme,
    format,
    profile
}: SlideViewerProps) {

    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !data) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.header}>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={32} />
                </button>
            </div>

            {format === 'carousel' && (
                <CarouselViewer
                    slides={data.slides}
                    theme={theme}
                    profile={profile}
                />
            )}

            {format === 'story' && (
                <StoryViewer
                    slides={data.slides}
                    theme={theme}
                    profile={profile}
                />
            )}

            {format === 'post' && (
                // Fallback or specific viewer for single post if needed
                <div style={{ color: 'white', textAlign: 'center' }}>
                    <h2>Single Post View</h2>
                </div>
            )}
        </div>
    );
}
