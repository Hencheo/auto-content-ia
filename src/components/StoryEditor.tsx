import React, { useState } from 'react';
import { GenericSlide } from './renderer/GenericSlide';
import { Theme } from '@/types/theme';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '@/contexts/UserContext';

interface StoryEditorProps {
    data: any;
    theme: Theme;
    onUpdate: (newData: any) => void;
}

export function StoryEditor({ data, theme, onUpdate }: StoryEditorProps) {
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
                console.log('Warmup failed', e);
            }
        }

        for (let i = 0; i < slides.length; i++) {
            const node = document.getElementById(`slide-${i}`);
            if (node) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    const dataUrl = await toPng(node, { pixelRatio: 1 });
                    const base64Data = dataUrl.split(',')[1];
                    zip.file(`story-${i + 1}.png`, base64Data, { base64: true });
                } catch (err) {
                    console.error('Erro ao processar slide', i, err);
                }
            }
        }

        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `stories-${data.theme.replace(/\s+/g, '-').toLowerCase()}.zip`);
        } catch (err) {
            console.error('Erro ao gerar ZIP', err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Resultado: {data.theme}</h2>
                <button onClick={handleDownload} className="btn" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                    Baixar ZIP
                </button>
            </div>

            {/* Preview Area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

                {/* Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="btn"
                        style={{ padding: '1rem', borderRadius: '50%', opacity: currentSlide === 0 ? 0.5 : 1 }}
                    >
                        &lt;
                    </button>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        {currentSlide + 1} / {data.slides.length}
                    </span>
                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === data.slides.length - 1}
                        className="btn"
                        style={{ padding: '1rem', borderRadius: '50%', opacity: currentSlide === data.slides.length - 1 ? 0.5 : 1 }}
                    >
                        &gt;
                    </button>
                </div>

                {/* Slide Preview (Scaled Down) */}
                <div style={{
                    width: '360px', // 1080 / 3
                    height: '640px', // 1920 / 3
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <GenericSlide
                        id="preview-slide"
                        data={data.slides[currentSlide]}
                        index={currentSlide}
                        total={data.slides.length}
                        profile={{ name, handle, image }}
                        theme={theme}
                        scale={0.3333} // Scale to fit 360px width
                    />
                </div>

                {/* Editor de Texto */}
                <div className="card" style={{ width: '100%', maxWidth: '600px', marginTop: '2rem', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Editar Slide {currentSlide + 1}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Título</label>
                            <input
                                type="text"
                                value={data.slides[currentSlide].title || ''}
                                onChange={(e) => {
                                    const newSlides = [...data.slides];
                                    newSlides[currentSlide] = { ...newSlides[currentSlide], title: e.target.value };
                                    onUpdate({ ...data, slides: newSlides });
                                }}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }}
                            />
                        </div>
                        {data.slides[currentSlide].body !== undefined && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Texto</label>
                                <textarea
                                    value={data.slides[currentSlide].body || ''}
                                    onChange={(e) => {
                                        const newSlides = [...data.slides];
                                        newSlides[currentSlide] = { ...newSlides[currentSlide], body: e.target.value };
                                        onUpdate({ ...data, slides: newSlides });
                                    }}
                                    rows={4}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white', resize: 'vertical' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Hidden Container for Export (Full Scale) */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
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
