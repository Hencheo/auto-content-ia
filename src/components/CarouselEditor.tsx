import React, { useState } from 'react';
import { GenericSlide } from './renderer/GenericSlide';
import { Theme } from '@/types/theme';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '@/contexts/UserContext';

interface CarouselEditorProps {
    data: any;
    theme: Theme;
    onUpdate: (newData: any) => void;
}

export function CarouselEditor({ data, theme, onUpdate }: CarouselEditorProps) {
    const { name, handle, avatar: image } = useUser();
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (data && currentSlide < data.slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };

    const handleDownload = async () => {
        if (!data) return;

        const zip = new JSZip();
        const slides = data.slides;

        // Warmup
        const firstNode = document.getElementById('slide-0');
        if (firstNode) {
            try {
                await toPng(firstNode, { pixelRatio: 1 });
            } catch (e) {
                console.log('Warmup capture failed', e);
            }
        }

        // Add slides to ZIP
        for (let i = 0; i < slides.length; i++) {
            const node = document.getElementById(`slide-${i}`);
            if (node) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    const dataUrl = await toPng(node, { pixelRatio: 1 });
                    const base64Data = dataUrl.split(',')[1];
                    zip.file(`slide-${i + 1}.png`, base64Data, { base64: true });
                } catch (err) {
                    console.error('Erro ao processar slide', i, err);
                }
            }
        }

        // Generate and download ZIP
        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${data.theme.replace(/\s+/g, '-').toLowerCase()}.zip`);
        } catch (err) {
            console.error('Erro ao gerar ZIP', err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Resultado: {data.theme}</h2>
                <button onClick={handleDownload} className="btn" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                    Baixar ZIP com Imagens
                </button>
            </div>

            {/* Caption */}
            {data.caption && (
                <div className="card generator-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="generator-section-title">Legenda Sugerida (Copywriting)</h3>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(data.caption);
                                alert('Legenda copiada!');
                            }}
                            className="btn"
                            style={{ backgroundColor: 'var(--accent-green)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                            Copiar Texto
                        </button>
                    </div>
                    <textarea
                        readOnly
                        value={data.caption}
                        className="generator-textarea"
                        style={{ height: '200px', fontSize: '1rem' }}
                    />
                </div>
            )}

            {/* Preview */}
            <div className="preview-wrapper">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="btn preview-nav-btn"
                >
                    &lt;
                </button>

                <div className="preview-slide-container">
                    <GenericSlide
                        id="preview-slide"
                        data={data.slides[currentSlide]}
                        index={currentSlide}
                        total={data.slides.length}
                        profile={{ name, handle, image }}
                        theme={theme}
                        scale={0.4}
                    />
                </div>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === data.slides.length - 1}
                    className="btn preview-nav-btn"
                >
                    &gt;
                </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                Slide {currentSlide + 1} de {data.slides.length}
            </div>

            {/* Editor */}
            <div className="card generator-card" style={{ border: '1px solid var(--border-color)' }}>
                <h3 className="generator-section-title" style={{ fontSize: '1.1rem' }}>
                    Editar Conteúdo do Slide {currentSlide + 1}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="editor-label">
                            Título
                        </label>
                        <input
                            type="text"
                            value={data.slides[currentSlide].title || ''}
                            onChange={(e) => {
                                const newSlides = [...data.slides];
                                newSlides[currentSlide] = { ...newSlides[currentSlide], title: e.target.value };
                                onUpdate({ ...data, slides: newSlides });
                            }}
                            className="generator-input"
                            style={{ padding: '0.75rem', color: 'white', background: 'var(--bg-primary)' }}
                        />
                    </div>

                    {data.slides[currentSlide].subtitle !== undefined && (
                        <div>
                            <label className="editor-label">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={data.slides[currentSlide].subtitle || ''}
                                onChange={(e) => {
                                    const newSlides = [...data.slides];
                                    newSlides[currentSlide] = { ...newSlides[currentSlide], subtitle: e.target.value };
                                    onUpdate({ ...data, slides: newSlides });
                                }}
                                className="generator-input"
                                style={{ padding: '0.75rem', color: 'white', background: 'var(--bg-primary)' }}
                            />
                        </div>
                    )}

                    {data.slides[currentSlide].body !== undefined && (
                        <div>
                            <label className="editor-label">
                                Texto Principal
                            </label>
                            <textarea
                                value={data.slides[currentSlide].body || ''}
                                onChange={(e) => {
                                    const newSlides = [...data.slides];
                                    newSlides[currentSlide] = { ...newSlides[currentSlide], body: e.target.value };
                                    onUpdate({ ...data, slides: newSlides });
                                }}
                                rows={4}
                                className="generator-textarea"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Export Container */}
            <div className="export-container-hidden">
                {data.slides.map((slide: any, index: number) => (
                    <GenericSlide
                        key={index}
                        id={`slide-${index}`}
                        data={slide}
                        index={index}
                        total={data.slides.length}
                        profile={{ name, handle, image }}
                        theme={theme}
                        scale={1}
                    />
                ))}
            </div>
        </div>
    );
}
