import React, { useState, useEffect } from 'react';
import { themes } from '@/styles/themeRegistry';
import { ThemePreviewCard } from './ThemePreviewCard';
import { CaptionDisplay } from './CaptionDisplay';
import { SlideViewer } from './SlideViewer';
import { useUser } from '@/contexts/UserContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';
import { GenericSlide } from './renderer/GenericSlide';
import { ChevronRight } from 'lucide-react';

interface ResultDisplayProps {
    result: any;
    format: 'carousel' | 'story' | 'post';
    themeId: string;
    onThemeChange: (themeId: string) => void;
    onBack: () => void;
    onUpdate: (newData: any) => void;
}

export function ResultDisplay({
    result,
    format,
    themeId,
    onThemeChange,
    onBack,
    onUpdate
}: ResultDisplayProps) {
    const { name, handle, avatar: image } = useUser();
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
    const [viewingSlidesTheme, setViewingSlidesTheme] = useState<any | null>(null);
    const [showScrollHint, setShowScrollHint] = useState(true);

    const availableThemes = themes.filter(t => t.type === format);

    // Hide scroll hint ONLY after interaction
    // useEffect(() => {
    //     const timer = setTimeout(() => setShowScrollHint(false), 5000);
    //     return () => clearTimeout(timer);
    // }, []);

    const handleDownload = async (themeToDownload: any) => {
        if (!result) return;
        alert(`Iniciando download com tema: ${themeToDownload.name}... (Lógica de download será migrada em breve)`);
    };

    const handleEdit = () => {
        alert("Editor completo em breve!");
    };

    const handleViewSlides = (theme: any) => {
        setViewingSlidesTheme(theme);
    };

    return (
        <div className="fade-in-up" style={{ width: '100%', paddingBottom: '4rem', position: 'relative' }}>

            {/* Slide Viewer Modal */}
            {viewingSlidesTheme && (
                <SlideViewer
                    data={result}
                    theme={viewingSlidesTheme}
                    profile={{ name, handle, image }}
                    onClose={() => setViewingSlidesTheme(null)}
                />
            )}

            {/* Click Outside Overlay */}
            {selectedThemeId && (
                <div
                    onClick={() => setSelectedThemeId(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 5,
                    }}
                />
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '0 1rem',
                position: 'relative',
                zIndex: 10
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    ← Voltar
                </button>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Escolha o Estilo</h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div style={{ position: 'relative' }}>
                <div
                    className="no-scrollbar"
                    onScroll={() => setShowScrollHint(false)}
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        padding: '1rem 2rem',
                        scrollSnapType: 'x mandatory',
                        marginBottom: '2rem',
                        minHeight: '450px',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 10
                    }}
                >
                    {availableThemes.map(theme => (
                        <ThemePreviewCard
                            key={theme.id}
                            data={result}
                            theme={theme}
                            isSelected={selectedThemeId === theme.id}
                            onSelect={() => {
                                setSelectedThemeId(theme.id);
                                onThemeChange(theme.id);
                            }}
                            onEdit={handleEdit}
                            onDownload={() => handleDownload(theme)}
                            onViewSlides={() => handleViewSlides(theme)}
                            profile={{ name, handle, image }}
                        />
                    ))}
                </div>

                {/* Scroll Hint Indicator */}
                {showScrollHint && availableThemes.length > 1 && (
                    <div
                        className="scroll-hint"
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 50, // Increased z-index
                            pointerEvents: 'none',
                            color: 'black', // High contrast
                            background: 'var(--accent-gold)', // High visibility
                            borderRadius: '50%',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                    >
                        <ChevronRight size={28} strokeWidth={3} />
                    </div>
                )}
            </div>

            {/* Caption Section */}
            {result.caption && (
                <CaptionDisplay caption={result.caption} />
            )}
        </div>
    );
}
