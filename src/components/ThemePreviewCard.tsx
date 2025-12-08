import React from 'react';
import { GenericSlide } from './renderer/GenericSlide';
import { getCarouselTemplate } from './templates/carousel';
import { Theme } from '@/types/theme';

interface ThemePreviewCardProps {
    data: any;
    theme: Theme;
    isSelected: boolean;
    onSelect: () => void;
    // Keeping these to avoid breaking parent usage, but they are unused here
    onEdit?: () => void;
    onDownload?: () => void;
    onViewSlides?: () => void;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
    isStory?: boolean;
    isCarousel?: boolean;
}

export function ThemePreviewCard({
    data,
    theme,
    isSelected,
    onSelect,
    profile,
    isStory = false,
    isCarousel = false
}: ThemePreviewCardProps) {
    // Only render if we have data
    const slideData = data.slides?.[0];
    if (!slideData) return null;

    // Checar se existe template modular para este tema
    const ModularTemplate = getCarouselTemplate(theme);

    return (
        <div
            className={`theme-preview-card-simple ${isSelected ? 'selected' : ''} ${isStory ? 'story-mode' : ''} ${isCarousel ? 'carousel-mode' : ''}`}
            onClick={onSelect}
        >
            {/* Center the Scaled Slide */}
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <div className={`theme-preview-scaler-container ${isStory ? 'story-mode' : ''}`}>
                    <div className="theme-preview-slide-box">
                        {/* Usa template modular se existir, senão usa GenericSlide */}
                        {ModularTemplate ? (
                            <ModularTemplate
                                id={`preview-${theme.id}`}
                                data={slideData}
                                index={0}
                                total={data.slides.length}
                                profile={profile}
                                theme={theme}
                                scale={1}
                            />
                        ) : (
                            <GenericSlide
                                id={`preview-${theme.id}`}
                                data={slideData}
                                index={0}
                                total={data.slides.length}
                                profile={profile}
                                theme={theme}
                                scale={1}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Badge overlay */}
            {!isSelected && (
                <div className="theme-card-badge">
                    {theme.name}
                </div>
            )}
        </div>
    );
}

