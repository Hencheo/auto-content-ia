/**
 * Breaking News Template - Design de notícias urgentes
 * 
 * Características:
 * - Fundo escuro com gradiente radial
 * - Badge "News" vermelha
 * - Tipografia bold para impacto
 * - Progress bar no footer
 */

import React from 'react';
import { StoryTemplateProps } from '../index';
import './styles.css';

export function BreakingNewsTemplate({
    data,
    index,
    total,
    id,
    profile,
    theme,
    scale = 1,
    sourceDomain
}: StoryTemplateProps) {
    const { styles } = theme;

    return (
        <div
            id={id}
            className="breaking-news-container"
            style={{
                transform: `scale(${scale})`,
                background: styles.background,
            }}
        >
            {/* Background Element */}
            <div className="breaking-news-bg" />

            {/* Header */}
            <div className="breaking-news-header">
                <div className="breaking-news-profile">
                    {/* Nome e @handle removidos - Instagram já exibe */}
                </div>
                <div
                    className="breaking-news-badge"
                    style={{ background: styles.accent }}
                >
                    News
                </div>
            </div>

            {/* Content */}
            <div className="breaking-news-content">
                {data.type === 'cover' && (
                    <>
                        <div
                            className="breaking-news-urgent"
                            style={{ background: styles.accent }}
                        >
                            URGENTE
                        </div>
                        <h1
                            className="breaking-news-title-cover"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h1>
                        <h2
                            className="breaking-news-subtitle"
                            style={{ color: styles.secondary }}
                        >
                            {data.subtitle}
                        </h2>
                    </>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <>
                        <h2
                            className="breaking-news-title-content"
                            style={{ color: styles.accent }}
                        >
                            {data.title}
                        </h2>
                        <p
                            className="breaking-news-body"
                            style={{ color: styles.text }}
                        >
                            {data.body}
                        </p>
                    </>
                )}

                {data.type === 'cta' && (
                    <div className="breaking-news-cta-container">
                        <h2
                            className="breaking-news-cta-title"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h2>
                        <div
                            className="breaking-news-cta-box"
                            style={{
                                borderColor: styles.accent,
                                background: `${styles.accent}15`
                            }}
                        >
                            <p className="breaking-news-cta-text">
                                {data.body}
                            </p>
                            <div
                                className="breaking-news-cta-footer"
                                style={{ color: styles.muted }}
                            >
                                👇 Responda abaixo
                            </div>
                        </div>
                        {sourceDomain && (
                            <div
                                className="breaking-news-source"
                                style={{ color: styles.muted }}
                            >
                                📰 Fonte: {sourceDomain}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Progress */}
            <div className="breaking-news-footer">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className="breaking-news-progress"
                        style={{
                            background: i <= index ? styles.accent : styles.muted
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
