/**
 * Minimalist Elegant Template - Design sofisticado e premium
 * 
 * Características:
 * - Fundo clean (off-white ou dark)
 * - Tipografia serifada elegante
 * - Alinhamento que alterna entre slides
 * - Aspas gigantes para citações
 * - Detalhes dourados sutis
 */

import React from 'react';
import { StoryTemplateProps } from '../index';
import './styles.css';

export function MinimalistElegantTemplate({
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

    // Alterna alinhamento baseado no índice
    const alignments = ['left', 'center', 'right'] as const;
    const currentAlignment = alignments[index % 3];

    return (
        <div
            id={id}
            className="minimal-elegant-container"
            style={{
                transform: `scale(${scale})`,
                background: styles.background,
            }}
        >
            {/* Decorative Lines */}
            <div
                className="minimal-line-top"
                style={{ background: styles.accent }}
            />
            <div
                className="minimal-line-bottom"
                style={{ background: styles.accent }}
            />

            {/* Header */}
            <div className="minimal-elegant-header">
                <span
                    className="minimal-chapter"
                    style={{ color: styles.muted }}
                >
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
            </div>

            {/* Content */}
            <div
                className="minimal-elegant-content"
                style={{ textAlign: currentAlignment }}
            >
                {data.type === 'cover' && (
                    <div className="minimal-cover-wrapper">
                        <span
                            className="minimal-eyebrow"
                            style={{ color: styles.accent }}
                        >
                            ✦
                        </span>
                        <h1
                            className="minimal-title-serif"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h1>
                        <div
                            className="minimal-elegant-divider"
                            style={{ background: styles.accent }}
                        />
                        <h2
                            className="minimal-subtitle-light"
                            style={{ color: styles.secondary }}
                        >
                            {data.subtitle}
                        </h2>
                    </div>
                )}

                {data.type === 'content' && (
                    <div
                        className={`minimal-content-wrapper align-${currentAlignment}`}
                    >
                        <h2
                            className="minimal-content-title"
                            style={{
                                color: styles.accent,
                                textAlign: currentAlignment
                            }}
                        >
                            {data.title}
                        </h2>
                        <p
                            className="minimal-content-body"
                            style={{
                                color: styles.text,
                                textAlign: currentAlignment,
                                fontSize: data.body && data.body.length > 250 ? '44px' : '52px'
                            }}
                        >
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'highlight' && (
                    <div className="minimal-highlight-wrapper">
                        <span
                            className="minimal-quote-open"
                            style={{ color: styles.accent }}
                        >
                            "
                        </span>
                        <h2
                            className="minimal-highlight-quote"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h2>
                        <span
                            className="minimal-quote-close"
                            style={{ color: styles.accent }}
                        >
                            "
                        </span>
                        {data.body && (
                            <p
                                className="minimal-highlight-author"
                                style={{ color: styles.secondary }}
                            >
                                — {data.body}
                            </p>
                        )}
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="minimal-cta-wrapper">
                        <h2
                            className="minimal-cta-title"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h2>
                        <div
                            className="minimal-cta-underline"
                            style={{ background: styles.accent }}
                        />
                        <p
                            className="minimal-cta-body"
                            style={{ color: styles.secondary }}
                        >
                            {data.body}
                        </p>
                        <div
                            className="minimal-cta-icon"
                            style={{ color: styles.accent }}
                        >
                            ↓
                        </div>
                        {sourceDomain && (
                            <div
                                className="minimal-source"
                                style={{ color: styles.muted }}
                            >
                                {sourceDomain}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Progress - Elegant dots */}
            <div className="minimal-elegant-footer">
                {Array.from({ length: total }).map((_, i) => (
                    <span
                        key={i}
                        className="minimal-progress-marker"
                        style={{
                            color: i === index ? styles.accent : styles.muted,
                            fontSize: i === index ? '20px' : '14px'
                        }}
                    >
                        {i === index ? '◆' : '◇'}
                    </span>
                ))}
            </div>
        </div>
    );
}
