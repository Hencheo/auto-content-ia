"use client";

import React, { useState, useRef } from 'react';
import Link from "next/link";
import { useUser } from '@/contexts/UserContext';
import { ChatInterface } from '@/components/ChatInterface';
import { Header } from '@/components/Header';
import { ResultDisplay } from '@/components/ResultDisplay';
import { generateCarouselContent, generateCarouselFromArticle, generateStoryContent } from '@/lib/gemini';

export default function Home() {
    const { profession, product, audience, avatar, voiceTone } = useUser();

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
            const context = { profession, product, audience, voiceTone };
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



    return (
        <div className="home-container">
            {!result && <Header compact={false} avatar={avatar} />}

            <main className="main-wrapper">

                {!result ? (
                    <div className="home-content">
                        <div className="hide-on-mobile home-intro">
                            <h1 className="home-title">
                                Crie conteúdos para redes sociais
                            </h1>
                            <p className="home-subtitle">
                                Carrosséis, Stories e Posts gerados por IA em segundos.
                            </p>
                        </div>
                        <ChatInterface onGenerate={handleGenerate} loading={loading} />
                    </div>
                ) : (
                    <ResultDisplay
                        result={result}
                        format={format}
                        themeId={themeId}
                        onThemeChange={handleThemeChange}
                        onBack={() => setResult(null)}
                        onUpdate={handleUpdate}
                    />
                )}

            </main>
        </div>
    );
}
