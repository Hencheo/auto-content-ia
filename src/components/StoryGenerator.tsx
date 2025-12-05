"use client";

import React, { useState, useRef } from 'react';
import { generateStoryContent } from '@/lib/gemini';
import { StorySlide, StoryTemplateId } from './StorySlide';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function StoryGenerator() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [storyData, setStoryData] = useState<any>(null);
    const [loadingStep, setLoadingStep] = useState<string>('');

    // Abort Controller Ref
    const abortControllerRef = useRef<AbortController | null>(null);

    // Profile State
    const [name, setName] = useState('Seu Nome');
    const [handle, setHandle] = useState('@seu_usuario');
    const [image, setImage] = useState<string | null>(null);
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
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
            const data = await generateStoryContent(content, controller.signal);

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
                <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--accent-gold)', textAlign: 'center' }}>
                    Gerador de Stories com IA
                </h1>

                {/* Configuração do Perfil */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Configuração do Perfil</h3>
                    <div className="grid-responsive" style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }}
                        />
                        <input
                            type="text"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="Usuário (@...)"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }}
                        />
                    </div>
                    <div className="flex-responsive" style={{ alignItems: 'center' }}>
                        <label className="btn" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            Escolher Foto
                            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                        {image && <span style={{ color: 'var(--accent-green)' }}>Foto carregada!</span>}
                    </div>
                </div>

                {/* Seleção de Template */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Estilo do Story</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setSelectedTemplate('breaking-news')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${selectedTemplate === 'breaking-news' ? '#ff0000' : 'var(--border-color)'}`,
                                backgroundColor: '#000',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            Notícia
                        </button>
                        <button
                            onClick={() => setSelectedTemplate('modern-story')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${selectedTemplate === 'modern-story' ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                                backgroundColor: '#fff',
                                color: '#000',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
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
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
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
                                className="btn"
                                style={{ padding: '1rem', borderRadius: '50%', opacity: currentSlide === 0 ? 0.5 : 1 }}
                            >
                                &lt;
                            </button>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {currentSlide + 1} / {storyData.slides.length}
                            </span>
                            <button
                                onClick={nextSlide}
                                disabled={currentSlide === storyData.slides.length - 1}
                                className="btn"
                                style={{ padding: '1rem', borderRadius: '50%', opacity: currentSlide === storyData.slides.length - 1 ? 0.5 : 1 }}
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
                        <div className="card" style={{ width: '100%', maxWidth: '600px', marginTop: '2rem', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                Editar Slide {currentSlide + 1}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Título</label>
                                    <input
                                        type="text"
                                        value={storyData.slides[currentSlide].title || ''}
                                        onChange={(e) => {
                                            const newSlides = [...storyData.slides];
                                            newSlides[currentSlide] = { ...newSlides[currentSlide], title: e.target.value };
                                            setStoryData({ ...storyData, slides: newSlides });
                                        }}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }}
                                    />
                                </div>
                                {storyData.slides[currentSlide].body !== undefined && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Texto</label>
                                        <textarea
                                            value={storyData.slides[currentSlide].body || ''}
                                            onChange={(e) => {
                                                const newSlides = [...storyData.slides];
                                                newSlides[currentSlide] = { ...newSlides[currentSlide], body: e.target.value };
                                                setStoryData({ ...storyData, slides: newSlides });
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
