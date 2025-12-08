import React, { useState, useEffect, useRef } from 'react';
import { themes } from '@/styles/themeRegistry';
import { ThemePreviewCard } from './ThemePreviewCard';
import { CaptionDisplay } from './CaptionDisplay';
import { useUser } from '@/contexts/UserContext';
import { ChevronLeft, Edit, Download, Eye, Check, Copy } from 'lucide-react';
import { SlideViewer } from './SlideViewer/SlideViewer';
import { downloadSlidesAsZip } from '@/lib/downloadUtils';
import { GenericSlide } from './renderer/GenericSlide';
import { StorySlide } from './StorySlide';
import { ContentEditor } from './ContentEditor';

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
    const [selectedThemeId, setSelectedThemeId] = useState<string>(themeId || 'financial-dark');
    const [activeIndex, setActiveIndex] = useState(0);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Floating Action Logic
    const [showActions, setShowActions] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const availableThemes = themes.filter(t => t.type === format);

    // Sync selected theme on mount
    useEffect(() => {
        if (themeId && themeId !== selectedThemeId) {
            setSelectedThemeId(themeId);
        }
    }, [themeId]);

    const handleMainScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;

        // Threshold to avoid jitter
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling down & past top -> Hide
            setShowActions(false);
        } else {
            // Scrolling up -> Show
            setShowActions(true);
        }
        setLastScrollY(currentScrollY);
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.children[0]?.clientWidth || 300;
            const gap = 24;
            const totalItemWidth = cardWidth + gap;
            const centerPosition = scrollLeft + (container.clientWidth / 2);
            const index = Math.floor(centerPosition / totalItemWidth);
            const safeIndex = Math.min(Math.max(index, 0), availableThemes.length - 1);
            setActiveIndex(safeIndex);
        }
    };

    const scrollToTheme = (index: number) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.children[0]?.clientWidth || 300;
            const gap = 24;
            const totalItemWidth = cardWidth + gap;
            // Center calculation: Scroll = (ItemLeft) - (ScreenHalf) + (ItemHalf)
            const targetScroll = (index * totalItemWidth) - (container.clientWidth / 2) + (cardWidth / 2);

            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
            setActiveIndex(index);
        }
    };

    const handleDownload = async () => {
        if (isDownloading) return;

        // Download não suportado para formato 'post' ainda
        if (format === 'post') {
            alert('Download para Post em breve!');
            return;
        }

        setIsDownloading(true);
        try {
            // Pequeno delay para garantir que os slides de export foram renderizados
            await new Promise(resolve => setTimeout(resolve, 300));

            await downloadSlidesAsZip({
                slides: result.slides,
                theme: result.theme || 'conteudo',
                caption: result.caption,
                format: format as 'carousel' | 'story',
                slideIdPrefix: 'export-slide'
            });
        } catch (error) {
            console.error('Erro no download:', error);
            alert('Erro ao gerar download. Tente novamente.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleEdit = () => {
        // Não suportado para formato 'post' ainda
        if (format === 'post') {
            alert('Editor para Post em breve!');
            return;
        }
        setIsEditorOpen(true);
    };

    const handleViewSlides = () => {
        setIsViewerOpen(true);
    };

    // Find the currently selected theme object
    const currentTheme = availableThemes.find(t => t.id === selectedThemeId) || availableThemes[0];

    return (
        <div className="mobile-result-container fade-in-up">

            {/* 1. Mobile Header */}
            <div className="mobile-header">
                <button onClick={onBack} className="mobile-back-btn">
                    <ChevronLeft size={24} />
                    <span>Voltar</span>
                </button>
                <div className="mobile-header-title">
                    Resultado
                </div>
            </div>

            {/* 2. Main Content (Carousel) */}
            <div className="mobile-content-area" onScroll={handleMainScroll}>
                <div className="mobile-carousel-section">
                    <div
                        ref={scrollContainerRef}
                        className="carousel-container"
                        onScroll={handleScroll}
                    >
                        {availableThemes.map((theme, index) => (
                            <div key={theme.id} className="theme-card-wrapper">
                                <ThemePreviewCard
                                    data={result}
                                    theme={theme}
                                    isSelected={selectedThemeId === theme.id}
                                    onSelect={() => {
                                        setSelectedThemeId(theme.id);
                                        onThemeChange(theme.id);
                                        scrollToTheme(index);
                                    }}
                                    onEdit={handleEdit}
                                    onDownload={handleDownload}
                                    onViewSlides={handleViewSlides}
                                    profile={{ name, handle, image }}
                                    isStory={format === 'story'}
                                    isCarousel={format === 'carousel'}
                                />
                            </div>
                        ))}
                    </div>
                    {/* Indicators */}
                    <div className="carousel-indicators">
                        {availableThemes.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => scrollToTheme(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Caption Preview (Read Only/Expandable) - Hide for Story */}
                {format !== 'story' && result.caption && (
                    <div className="mobile-caption-preview">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <strong>Legenda Sugerida:</strong>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(result.caption);
                                    alert("Legenda copiada!");
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <Copy size={18} />
                            </button>
                        </div>

                        <div style={{
                            maxHeight: showFullCaption ? 'none' : '80px',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                        }}>
                            {result.caption}
                        </div>
                        <button
                            onClick={() => setShowFullCaption(!showFullCaption)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--accent-gold)',
                                fontSize: '0.8rem',
                                marginTop: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            {showFullCaption ? 'Ver menos' : 'Ver mais'}
                        </button>
                    </div>
                )}

                {/* Spacer to prevent content from being hidden behind pill if scrolling */}
                <div style={{ height: '80px' }}></div>
            </div>

            {/* Floating Action Pill */}
            <div
                className={`mobile-floating-actions ${showActions ? 'visible' : 'hidden'}`}
            >
                <button className="mobile-floating-btn" onClick={handleViewSlides} title="Visualizar">
                    <Eye size={22} />
                </button>
                <button
                    className="mobile-floating-btn primary"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{ opacity: isDownloading ? 0.6 : 1 }}
                    title="Baixar"
                >
                    <Download size={22} />
                </button>
                <button className="mobile-floating-btn" onClick={handleEdit} title="Editar">
                    <Edit size={22} />
                </button>
            </div>

            {/* Container Invisível para Export (slides em tamanho real) */}
            <div className="export-container-hidden">
                {result.slides.map((slide: any, index: number) => (
                    format === 'story' ? (
                        <StorySlide
                            key={index}
                            data={slide}
                            index={index}
                            total={result.slides.length}
                            id={`export-slide-${index}`}
                            profile={{ name, handle, image }}
                            templateId={currentTheme.id === 'modern-story' ? 'modern-story' : 'breaking-news'}
                            scale={1}
                        />
                    ) : (
                        <GenericSlide
                            key={index}
                            data={slide}
                            index={index}
                            total={result.slides.length}
                            id={`export-slide-${index}`}
                            profile={{ name, handle, image }}
                            theme={currentTheme}
                            scale={1}
                        />
                    )
                ))}
            </div>

            <SlideViewer
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                data={result}
                theme={currentTheme}
                format={format}
                profile={{ name, handle, image }}
            />

            {/* Content Editor Modal */}
            {format !== 'post' && (
                <ContentEditor
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    data={result}
                    onUpdate={onUpdate}
                    theme={currentTheme}
                    format={format as 'carousel' | 'story'}
                    profile={{ name, handle, image }}
                />
            )}
        </div >
    );
}
