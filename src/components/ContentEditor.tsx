/**
 * ContentEditor - Modal/Drawer para edição de slides
 * Componente modular que não afeta outros componentes existentes
 */

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { GenericSlide } from './renderer/GenericSlide';
import { StorySlide } from './StorySlide';
import { Theme } from '@/types/theme';
import styles from './ContentEditor.module.css';

interface ContentEditorProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onUpdate: (newData: any) => void;
    theme: Theme;
    format: 'carousel' | 'story';
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
}

export function ContentEditor({
    isOpen,
    onClose,
    data,
    onUpdate,
    theme,
    format,
    profile
}: ContentEditorProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [editedData, setEditedData] = useState<any>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Sincronizar dados quando o modal abre
    useEffect(() => {
        if (isOpen && data) {
            setEditedData(JSON.parse(JSON.stringify(data))); // Deep clone
            setCurrentSlide(0);
            setHasChanges(false);
        }
    }, [isOpen, data]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    handleClose();
                    break;
                case 'ArrowLeft':
                    prevSlide();
                    break;
                case 'ArrowRight':
                    nextSlide();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentSlide, editedData]);

    if (!isOpen || !editedData) return null;

    const slides = editedData.slides || [];
    const currentSlideData = slides[currentSlide];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };

    const updateSlideField = (field: string, value: string) => {
        const newData = { ...editedData };
        newData.slides = [...newData.slides];
        newData.slides[currentSlide] = {
            ...newData.slides[currentSlide],
            [field]: value
        };
        setEditedData(newData);
        setHasChanges(true);
    };

    const handleSave = () => {
        onUpdate(editedData);
        setHasChanges(false);
        onClose();
    };

    const handleClose = () => {
        if (hasChanges) {
            const confirm = window.confirm('Você tem alterações não salvas. Deseja descartar?');
            if (!confirm) return;
        }
        onClose();
    };

    // Calcular escala para o preview
    const previewScale = format === 'story' ? 0.25 : 0.3;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.drawer} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Editar Conteúdo</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {/* Preview Section */}
                    <div className={styles.previewSection}>
                        <div className={styles.previewContainer}>
                            <div
                                className={styles.previewScaler}
                                style={{
                                    transform: `scale(${previewScale})`,
                                    width: '1080px',
                                    height: format === 'story' ? '1920px' : '1350px',
                                }}
                            >
                                {format === 'story' ? (
                                    <StorySlide
                                        data={currentSlideData}
                                        index={currentSlide}
                                        total={slides.length}
                                        id={`editor-preview-${currentSlide}`}
                                        profile={profile}
                                        templateId={theme.id === 'modern-story' ? 'modern-story' : 'breaking-news'}
                                        scale={1}
                                    />
                                ) : (
                                    <GenericSlide
                                        data={currentSlideData}
                                        index={currentSlide}
                                        total={slides.length}
                                        id={`editor-preview-${currentSlide}`}
                                        profile={profile}
                                        theme={theme}
                                        scale={1}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className={styles.navigation}>
                            <button
                                className={styles.navBtn}
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <span className={styles.navCounter}>
                                {currentSlide + 1} / {slides.length}
                            </span>
                            <button
                                className={styles.navBtn}
                                onClick={nextSlide}
                                disabled={currentSlide === slides.length - 1}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Editor Section */}
                    <div className={styles.editorSection}>
                        <h3 className={styles.editorTitle}>
                            Slide {currentSlide + 1}
                            <span className={styles.slideType}>
                                {currentSlideData?.type || 'content'}
                            </span>
                        </h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Título</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={currentSlideData?.title || ''}
                                onChange={(e) => updateSlideField('title', e.target.value)}
                                placeholder="Digite o título..."
                            />
                        </div>

                        {currentSlideData?.subtitle !== undefined && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Subtítulo</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={currentSlideData?.subtitle || ''}
                                    onChange={(e) => updateSlideField('subtitle', e.target.value)}
                                    placeholder="Digite o subtítulo..."
                                />
                            </div>
                        )}

                        {currentSlideData?.body !== undefined && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Texto</label>
                                <textarea
                                    className={styles.textarea}
                                    value={currentSlideData?.body || ''}
                                    onChange={(e) => updateSlideField('body', e.target.value)}
                                    placeholder="Digite o texto..."
                                    rows={4}
                                />
                            </div>
                        )}

                        {/* Editar Legenda (apenas Carousel) */}
                        {format === 'carousel' && currentSlide === 0 && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Legenda do Post</label>
                                <textarea
                                    className={styles.textarea}
                                    value={editedData?.caption || ''}
                                    onChange={(e) => {
                                        setEditedData({ ...editedData, caption: e.target.value });
                                        setHasChanges(true);
                                    }}
                                    placeholder="Digite a legenda..."
                                    rows={5}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={handleClose}>
                        Cancelar
                    </button>
                    <button
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        <Save size={18} />
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
