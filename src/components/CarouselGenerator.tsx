"use client";

import React, { useState } from 'react';
import { generateCarouselContent } from '@/lib/gemini';
import { Slide } from './Slide';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function CarouselGenerator() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [carouselData, setCarouselData] = useState<any>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const data = await generateCarouselContent(topic);
            setCarouselData(data);
        } catch (error) {
            alert('Erro ao gerar conteúdo. Verifique sua API Key.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!carouselData) return;

        const zip = new JSZip();
        const slides = carouselData.slides;

        // Adicionar cada slide ao ZIP
        for (let i = 0; i < slides.length; i++) {
            const node = document.getElementById(`slide-${i}`);
            if (node) {
                try {
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
            <div style={{ maxWidth: '600px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
                    Gerador de Carrossel 360º
                </h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    Digite o tema ou a dor do seu cliente (ex: "Mistura PF/PJ").
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ex: Empresário sem tempo..."
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
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ minWidth: '120px' }}
                    >
                        {loading ? 'Gerando...' : 'Gerar'}
                    </button>
                </div>
            </div>

            {carouselData && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Resultado: {carouselData.theme}</h2>
                        <button onClick={handleDownload} className="btn" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
                            Baixar ZIP com Imagens
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                        gap: '2rem',
                        justifyItems: 'center'
                    }}>
                        {carouselData.slides.map((slide: any, index: number) => (
                            <div key={index} style={{ width: '450px', height: '560px', overflow: 'hidden', border: '1px solid #333' }}>
                                <Slide
                                    id={`slide-${index}`}
                                    data={slide}
                                    index={index}
                                    total={carouselData.slides.length}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
