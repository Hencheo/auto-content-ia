"use client";

import React, { useState, useRef } from 'react';
import Link from "next/link";
import { useUser } from '@/contexts/UserContext';
import { ChatInterface } from '@/components/ChatInterface';
import { CarouselEditor } from '@/components/CarouselEditor';
import { StoryEditor } from '@/components/StoryEditor';
import { generateCarouselContent, generateCarouselFromArticle, generateStoryContent } from '@/lib/gemini';
import { themes, getTheme } from '@/styles/themeRegistry';
import logo from './assets/logo.png';
import { User } from 'lucide-react';

export default function Home() {
    const { profession, product, audience, avatar } = useUser();

    // State
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [format, setFormat] = useState<'carousel' | 'story' | 'post'>('carousel');
    const [themeId, setThemeId] = useState<string>('financial-dark');

    // Abort Controller
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleGenerate = async (input: string, selectedFormat: 'carousel' | 'story' | 'post') => {
        if (selectedFormat === 'post') {
            alert('Funcionalidade de Post em breve!');
            return;
        }

        setFormat(selectedFormat);
        setLoading(true);
        setResult(null);

        // Cancel previous
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const context = { profession, product, audience };
            const isUrl = input.trim().startsWith('http');
            let data;

            if (selectedFormat === 'carousel') {
                // Set default theme for carousel
                setThemeId('financial-dark');

                if (isUrl) {
                    // Scrape first
                    const scrapeRes = await fetch('/api/scrape', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: input }),
                        signal: controller.signal
                    });
                    if (!scrapeRes.ok) throw new Error('Falha ao ler link');
                    const scrapeData = await scrapeRes.json();
                    const content = `TÍTULO: ${scrapeData.title}\n\nCONTEÚDO: ${scrapeData.content}`;
                    data = await generateCarouselFromArticle(content, controller.signal, context);
                } else {
                    data = await generateCarouselContent(input, controller.signal, context);
                }
            } else if (selectedFormat === 'story') {
                // Set default theme for story
                setThemeId('breaking-news');

                if (isUrl) {
                    const scrapeRes = await fetch('/api/scrape', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: input }),
                        signal: controller.signal
                    });
                    if (!scrapeRes.ok) throw new Error('Falha ao ler link');
                    const scrapeData = await scrapeRes.json();
                    const content = `TÍTULO: ${scrapeData.title}\n\nCONTEÚDO: ${scrapeData.content}`;
                    data = await generateStoryContent(content, controller.signal, context);
                } else {
                    // Treat input as content/topic for story
                    data = await generateStoryContent(input, controller.signal, context);
                }
            }

            if (!controller.signal.aborted) {
                // Attach theme info to data if not present, or just use local state
                setResult({ ...data, theme: themeId }); // We might need to sync this
            }

        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error(error);
                alert('Erro ao gerar: ' + error.message);
            }
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    const handleUpdate = (newData: any) => {
        setResult(newData);
    };

    const handleThemeChange = (newThemeId: string) => {
        setThemeId(newThemeId);
        // Update result theme name for consistency if needed, though visual relies on themeId
    };

    const currentTheme = getTheme(themeId);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header Minimalista */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid var(--border-color)'
            }}>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo.src} alt="AutoContent Logo" className="logo-img" />
                </div>
                <Link href="/profile" className="btn" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    {avatar ? (
                        <img src={avatar} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <User size={20} color="var(--text-secondary)" />
                    )}
                </Link>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem' }}>

                {!result ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '2rem' }}>
                        <div className="hide-on-mobile" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '2rem', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                O que vamos criar hoje?
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                                Transforme suas ideias em conteúdo viral em segundos.
                            </p>
                        </div>
                        <ChatInterface onGenerate={handleGenerate} loading={loading} />
                    </div>
                ) : (
                    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                        <button
                            onClick={() => setResult(null)}
                            style={{
                                marginBottom: '2rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            ← Criar Novo Conteúdo
                        </button>

                        {/* Theme Selector */}
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tema Visual</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {themes.filter(t => t.type === format).map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleThemeChange(t.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-sm)',
                                            border: `1px solid ${themeId === t.id ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                                            background: themeId === t.id ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                            color: themeId === t.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {format === 'carousel' && (
                            <CarouselEditor data={result} theme={currentTheme} onUpdate={handleUpdate} />
                        )}

                        {format === 'story' && (
                            <StoryEditor data={result} theme={currentTheme} onUpdate={handleUpdate} />
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}
