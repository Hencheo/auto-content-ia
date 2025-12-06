"use client";

import React, { useState, useRef } from 'react';
import { generateCarouselContent, generateCarouselFromArticle } from '@/lib/gemini';
import { Slide, TemplateId } from './Slide';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '@/contexts/UserContext';

export function CarouselGenerator() {
    const { name, handle, avatar: image, profession, product, audience } = useUser();
    const [inputType, setInputType] = useState<'topic' | 'url'>('topic');
    const [topic, setTopic] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [carouselData, setCarouselData] = useState<any>(null);

    // Abort Controller Ref
    const abortControllerRef = useRef<AbortController | null>(null);

    // Profile State
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('financial-dark');

    // Carousel Navigation State
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (carouselData && currentSlide < carouselData.slides.length - 1) {
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
        if (inputType === 'topic' && !topic) return;
        if (inputType === 'url' && !url) return;

        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new controller
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setCarouselData(null); // Clear previous data
        setCurrentSlide(0); // Reset slide

        try {
            let data;

            const context = { profession, product, audience };

            if (inputType === 'topic') {
                setLoadingStep('Gerando conteúdo estratégico...');
                data = await generateCarouselContent(topic, controller.signal, context);
            } else {
                // URL Flow
                setLoadingStep('Lendo o artigo...');
                const scrapeRes = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                    signal: controller.signal
                });

                if (!scrapeRes.ok) throw new Error('Falha ao ler a notícia');
                const scrapeData = await scrapeRes.json();

                if (controller.signal.aborted) return;

                setLoadingStep('Transformando em carrossel...');
                const content = `TÍTULO: ${scrapeData.title}\n\nCONTEÚDO: ${scrapeData.content}`;
                data = await generateCarouselFromArticle(content, controller.signal, context);
            }

            if (controller.signal.aborted) return;
            setCarouselData(data);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Geração cancelada pelo usuário.');
            } else {
                alert('Erro ao gerar conteúdo. Verifique sua API Key.');
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

    const handleCancel = () => {
        console.log('Cancelando geração...');
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        // Garante que o estado seja atualizado no próximo ciclo de renderização
        setTimeout(() => {
            setLoading(false);
            console.log('Estado de loading definido para false.');
        }, 0);
    };

    const handleDownload = async () => {
        if (!carouselData) return;

        const zip = new JSZip();
        const slides = carouselData.slides;

        // Workaround para iOS/Safari: O primeiro slide muitas vezes perde a imagem.
        // Fazemos uma captura "falsa" do primeiro slide para "aquecer" o renderizador.
        const firstNode = document.getElementById('slide-0');
        if (firstNode) {
            try {
                await toPng(firstNode, { pixelRatio: 1 });
            } catch (e) {
                console.log('Warmup capture failed', e);
            }
        }

        // Adicionar cada slide ao ZIP
        for (let i = 0; i < slides.length; i++) {
            const node = document.getElementById(`slide-${i}`);
            if (node) {
                try {
                    // Pequeno delay para garantir renderização em dispositivos móveis
                    await new Promise(resolve => setTimeout(resolve, 50));

                    const dataUrl = await toPng(node, { pixelRatio: 1 });
                    // Remover o prefixo data:image/png;base64, para o JSZip
                    const base64Data = dataUrl.split(',')[1];
                    zip.file(`slide-${i + 1}.png`, base64Data, { base64: true });
                } catch (err) {
                    console.error('Erro ao processar slide', i, err);
                }
            }
        }

        // Gerar e baixar o ZIP
        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${carouselData.theme.replace(/\s+/g, '-').toLowerCase()}.zip`);
        } catch (err) {
            console.error('Erro ao gerar ZIP', err);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
                <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--accent-gold)', textAlign: 'center' }}>
                    Gerador de Carrossel 360º
                </h1>


                {/* Seleção de Template */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Escolha o Estilo</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setSelectedTemplate('financial-dark')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${selectedTemplate === 'financial-dark' ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                                backgroundColor: 'var(--bg-primary)',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            Financial Dark
                        </button>
                        <button
                            onClick={() => setSelectedTemplate('modern-clean')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${selectedTemplate === 'modern-clean' ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                                backgroundColor: '#f1f5f9',
                                color: '#0f172a',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            Modern Clean
                        </button>
                    </div>
                </div>

                {/* Input de Geração */}
                <form onSubmit={handleGenerate} className="flex-responsive" style={{ flexDirection: 'column', gap: '1rem' }}>

                    {/* Toggle Input Type */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setInputType('topic')}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                backgroundColor: inputType === 'topic' ? 'var(--accent-gold)' : 'var(--bg-card)',
                                color: inputType === 'topic' ? 'black' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Digitar Tema
                        </button>
                        <button
                            type="button"
                            onClick={() => setInputType('url')}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                backgroundColor: inputType === 'url' ? 'var(--accent-gold)' : 'var(--bg-card)',
                                color: inputType === 'url' ? 'black' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Colar Link
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        {loading ? (
                            <div className="progress-bar-container" style={{ flex: 1 }}>
                                <div className="progress-bar-fill" />
                                <span className="progress-text">{loadingStep || 'Gerando conteúdo...'}</span>
                            </div>
                        ) : (
                            inputType === 'topic' ? (
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Digite o tema (ex: Empresário sem tempo...)"
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
                            ) : (
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Cole o link da notícia (https://...)"
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
                            )
                        )}
                        {loading ? (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn"
                                style={{ minWidth: '120px', backgroundColor: 'var(--accent-danger)', color: 'white' }}
                            >
                                Cancelar
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ minWidth: '120px', backgroundColor: 'var(--accent-green)', color: 'white' }}
                            >
                                Gerar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {carouselData && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Resultado: {carouselData.theme}</h2>
                        <button onClick={handleDownload} className="btn" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                            Baixar ZIP com Imagens
                        </button>
                    </div>

                    {/* Legenda Gerada */}
                    {carouselData.caption && (
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ color: 'var(--text-secondary)' }}>Legenda Sugerida (Copywriting)</h3>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(carouselData.caption);
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
                                value={carouselData.caption}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                    )}

                    {/* Carousel View */}
                    <div className="preview-wrapper">
                        <button
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className="btn"
                            style={{ padding: '1rem', borderRadius: '50%', opacity: currentSlide === 0 ? 0.5 : 1 }}
                        >
                            &lt;
                        </button>

                        <div className="preview-container">
                            <Slide
                                id="preview-slide"
                                data={carouselData.slides[currentSlide]}
                                index={currentSlide}
                                total={carouselData.slides.length}
                                profile={{ name, handle, image }}
                                scale={0.4}
                                templateId={selectedTemplate}
                            />
                        </div>

                        <button
                            onClick={nextSlide}
                            disabled={currentSlide === carouselData.slides.length - 1}
                            className="btn"
                            style={{ padding: '1rem', borderRadius: '50%', opacity: currentSlide === carouselData.slides.length - 1 ? 0.5 : 1 }}
                        >
                            &gt;
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        Slide {currentSlide + 1} de {carouselData.slides.length}
                    </div>

                    {/* Editor de Slide */}
                    <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Editar Conteúdo do Slide {currentSlide + 1}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Título */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={carouselData.slides[currentSlide].title || ''}
                                    onChange={(e) => {
                                        const newSlides = [...carouselData.slides];
                                        newSlides[currentSlide] = { ...newSlides[currentSlide], title: e.target.value };
                                        setCarouselData({ ...carouselData, slides: newSlides });
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-primary)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            {/* Subtítulo (se houver) */}
                            {carouselData.slides[currentSlide].subtitle !== undefined && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Subtítulo
                                    </label>
                                    <input
                                        type="text"
                                        value={carouselData.slides[currentSlide].subtitle || ''}
                                        onChange={(e) => {
                                            const newSlides = [...carouselData.slides];
                                            newSlides[currentSlide] = { ...newSlides[currentSlide], subtitle: e.target.value };
                                            setCarouselData({ ...carouselData, slides: newSlides });
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-primary)',
                                            color: 'white'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Corpo (se houver) */}
                            {carouselData.slides[currentSlide].body !== undefined && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Texto Principal
                                    </label>
                                    <textarea
                                        value={carouselData.slides[currentSlide].body || ''}
                                        onChange={(e) => {
                                            const newSlides = [...carouselData.slides];
                                            newSlides[currentSlide] = { ...newSlides[currentSlide], body: e.target.value };
                                            setCarouselData({ ...carouselData, slides: newSlides });
                                        }}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-primary)',
                                            color: 'white',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hidden Container for Export (Full Scale) */}
                    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                        {carouselData.slides.map((slide: any, index: number) => (
                            <Slide
                                key={index}
                                id={`slide-${index}`}
                                data={slide}
                                index={index}
                                total={carouselData.slides.length}
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
