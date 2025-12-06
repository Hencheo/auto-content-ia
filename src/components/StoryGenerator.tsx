"use client";

import React, { useState, useRef } from 'react';
import { generateStoryContent } from '@/lib/gemini';
import { StorySlide, StoryTemplateId } from './StorySlide';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '@/contexts/UserContext';

export function StoryGenerator() {
    const { name, handle, avatar: image, profession, product, audience } = useUser();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [storyData, setStoryData] = useState<any>(null);
    const [loadingStep, setLoadingStep] = useState<string>('');

    // Abort Controller Ref
    const abortControllerRef = useRef<AbortController | null>(null);

    // Profile State
    const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplateId>('breaking-news');

    // Navigation State
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (storyData && currentSlide < storyData.slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };


    const handleGenerate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!url) return;

        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setStoryData(null);
        setCurrentSlide(0);

        try {
            // Step 1: Scrape URL
            setLoadingStep('Lendo a notícia...');
            const scrapeRes = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
                signal: controller.signal
            });

            if (!scrapeRes.ok) throw new Error('Falha ao ler a notícia');
            const scrapeData = await scrapeRes.json();

            if (controller.signal.aborted) return;

            // Step 2: Generate Story Content
            setLoadingStep('Criando storytelling...');
            const content = `TÍTULO: ${scrapeData.title}\n\nCONTEÚDO: ${scrapeData.content}`;
            const context = { profession, product, audience };
            const data = await generateStoryContent(content, controller.signal, context);

            if (controller.signal.aborted) return;
            setStoryData(data);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Geração cancelada.');
            } else {
                alert('Erro ao gerar stories: ' + error.message);
                console.error(error);
            }
        } finally {
            if (abortControllerRef.current === controller) {
                setLoading(false);
                setLoadingStep('');
                abortControllerRef.current = null;
            }
        }
    };

    const handleDownload = async () => {
        if (!storyData) return;

        const zip = new JSZip();
        const slides = storyData.slides;

        // Warmup
        const firstNode = document.getElementById('story-slide-0');
        if (firstNode) {
            try {
                await toPng(firstNode, { pixelRatio: 1 });
            } catch (e) {
                console.log('Warmup failed', e);
            }
        }

        for (let i = 0; i < slides.length; i++) {
            const node = document.getElementById(`story-slide-${i}`);
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
            saveAs(content, `stories-${storyData.theme.replace(/\s+/g, '-').toLowerCase()}.zip`);
        } catch (err) {
            console.error('Erro ao gerar ZIP', err);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
                <h1 className="page-title generator-page-title">
                    Gerador de Stories com IA
                </h1>


                {/* Seleção de Template */}
                <div className="card generator-card">
                    <h3 className="generator-section-title">Estilo do Story</h3>
                    <div className="template-selection-container">
                        <button
                            onClick={() => setSelectedTemplate('breaking-news')}
                            className={`template-select-btn breaking-news ${selectedTemplate === 'breaking-news' ? 'active' : ''}`}
                        >
                            Notícia
                        </button>
                        <button
                            onClick={() => setSelectedTemplate('modern-story')}
                            className={`template-select-btn modern-story ${selectedTemplate === 'modern-story' ? 'active' : ''}`}
                        >
                            Minimalista
                        </button>
                    </div>
                </div>

                {/* Input de URL */}
                <form onSubmit={handleGenerate} className="flex-responsive">
                    {loading ? (
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" />
                            <span className="progress-text">{loadingStep}</span>
                        </div>
                    ) : (
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Cole o link da notícia aqui (https://...)"
                            className="generator-input"
                        />
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ minWidth: '120px', backgroundColor: loading ? 'var(--text-muted)' : 'var(--accent-green)', color: 'white' }}
                    >
                        {loading ? 'Gerando...' : 'Gerar Stories'}
                    </button>
                </form>
            </div>

            {storyData && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Resultado: {storyData.theme}</h2>
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
                                className="btn preview-nav-btn"
                            >
                                &lt;
                            </button>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {currentSlide + 1} / {storyData.slides.length}
                            </span>
                            <button
                                onClick={nextSlide}
                                disabled={currentSlide === storyData.slides.length - 1}
                                className="btn preview-nav-btn"
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
                            <StorySlide
                                id="preview-story-slide"
                                data={storyData.slides[currentSlide]}
                                index={currentSlide}
                                total={storyData.slides.length}
                                profile={{ name, handle, image }}
                                scale={0.3333} // Scale to fit 360px width
                                templateId={selectedTemplate}
                            />
                        </div>

                        {/* Editor de Texto (Reutilizando a lógica do Carrossel) */}
                        <div className="card generator-card" style={{ width: '100%', maxWidth: '600px', marginTop: '2rem', border: '1px solid var(--border-color)' }}>
                            <h3 className="generator-section-title" style={{ fontSize: '1.1rem' }}>
                                Editar Slide {currentSlide + 1}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="editor-label">Título</label>
                                    <input
                                        type="text"
                                        value={storyData.slides[currentSlide].title || ''}
                                        onChange={(e) => {
                                            const newSlides = [...storyData.slides];
                                            newSlides[currentSlide] = { ...newSlides[currentSlide], title: e.target.value };
                                            setStoryData({ ...storyData, slides: newSlides });
                                        }}
                                        className="generator-input"
                                        style={{ padding: '0.75rem', color: 'white', background: 'var(--bg-primary)' }}
                                    />
                                </div>
                                {storyData.slides[currentSlide].body !== undefined && (
                                    <div>
                                        <label className="editor-label">Texto</label>
                                        <textarea
                                            value={storyData.slides[currentSlide].body || ''}
                                            onChange={(e) => {
                                                const newSlides = [...storyData.slides];
                                                newSlides[currentSlide] = { ...newSlides[currentSlide], body: e.target.value };
                                                setStoryData({ ...storyData, slides: newSlides });
                                            }}
                                            rows={4}
                                            className="generator-textarea"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Hidden Container for Export (Full Scale) */}
                    <div className="export-container-hidden">
                        {storyData.slides.map((slide: any, index: number) => (
                            <StorySlide
                                key={index}
                                id={`story-slide-${index}`}
                                data={slide}
                                index={index}
                                total={storyData.slides.length}
                                profile={{ name, handle, image }}
                                scale={1}
                                templateId={selectedTemplate}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
