import React from 'react';
import { GenericSlide } from './renderer/GenericSlide';
import { Theme } from '@/types/theme';
import { Edit, Download, Eye } from 'lucide-react';

interface ThemePreviewCardProps {
    data: any;
    theme: Theme;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDownload: () => void;
    onViewSlides: () => void;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
}

export function ThemePreviewCard({
    data,
    theme,
    isSelected,
    onSelect,
    onEdit,
    onDownload,
    onViewSlides,
    profile
}: ThemePreviewCardProps) {
    // Use slide 0 (cover) for preview
    const slideData = data.slides[0];

    if (!slideData) return null;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            className={`theme-card ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'relative',
                width: '300px',
                height: '375px', // Fixed height 4:5 ratio of 300px
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                scrollSnapAlign: 'center',
                flexShrink: 0,
                backgroundColor: 'var(--bg-card)'
            }}
        >
            <div style={{
                pointerEvents: 'none',
                width: '100%',
                height: '100%',
                filter: isSelected ? 'blur(4px) brightness(0.5)' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: 'scale(0.2777)',
                    transformOrigin: 'top left',
                    width: '1080px',
                    height: '1350px'
                }}>
                    <GenericSlide
                        id={`preview-${theme.id}`}
                        data={slideData}
                        index={0}
                        total={data.slides.length}
                        profile={profile}
                        theme={theme}
                        scale={1}
                    />
                </div>
            </div>

            {/* Overlay Actions */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.75rem',
                    opacity: isSelected ? 1 : 0,
                    pointerEvents: isSelected ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease',
                    zIndex: 10
                }}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onViewSlides(); }}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'white',
                        color: 'black',
                        fontWeight: 'bold',
                        width: '180px',
                        justifyContent: 'center'
                    }}
                >
                    <Eye size={18} />
                    Ver Slides
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--accent-gold)',
                        color: 'black',
                        fontWeight: 'bold',
                        width: '180px',
                        justifyContent: 'center'
                    }}
                >
                    <Edit size={18} />
                    Editar Texto
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                    className="btn-secondary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        width: '180px',
                        justifyContent: 'center'
                    }}
                >
                    <Download size={18} />
                    Baixar ZIP
                </button>
            </div>

            {/* Theme Name Badge */}
            {!isSelected && (
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                }}>
                    {theme.name}
                </div>
            )}
        </div>
    );
}
