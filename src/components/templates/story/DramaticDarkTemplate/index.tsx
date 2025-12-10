/**
 * Dramatic Dark Template - Design cinematográfico dramático
 * 
 * Características:
 * - Fundo preto com gradientes dramáticos
 * - Tipografia dinâmica que varia por slide
 * - Acentos em vermelho/laranja como chamas
 * - Layout alternado para ritmo visual
 */

import React from 'react';
import { StoryTemplateProps } from '../index';
import './styles.css';

export function DramaticDarkTemplate({
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

    // Determina classe dinâmica baseada no índice para variação
    const dynamicClass = index % 2 === 0 ? 'layout-a' : 'layout-b';

    return (
        <div
            id={id}
            className={`dramatic-dark-container ${dynamicClass}`}
            style={{
                transform: `scale(${scale})`,
                background: styles.background,
            }}
        >
            {/* Background Dramático */}
            <div className="dramatic-dark-bg" />
            <div className="dramatic-dark-flames" />

            {/* Header Minimalista */}
            <div className="dramatic-dark-header">
                <div
                    className="dramatic-dark-accent-line"
                    style={{ background: styles.accent }}
                />
            </div>

            {/* Content */}
            <div className="dramatic-dark-content">
                {data.type === 'cover' && (
                    <div className="dramatic-cover-wrapper">

                        <h1
                            className="dramatic-title-main"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h1>
                        <div
                            className="dramatic-divider"
                            style={{ background: `linear-gradient(90deg, transparent, ${styles.accent}, transparent)` }}
                        />
                        <h2
                            className="dramatic-subtitle"
                            style={{ color: styles.secondary }}
                        >
                            {data.subtitle}
                        </h2>
                    </div>
                )}

                {data.type === 'content' && (
                    <div className={`dramatic-content-wrapper ${dynamicClass}`}>
                        <h2
                            className="dramatic-content-title"
                            style={{
                                color: styles.accent,
                                textAlign: index % 2 === 0 ? 'left' : 'right'
                            }}
                        >
                            {data.title}
                        </h2>
                        <p
                            className="dramatic-content-body"
                            style={{
                                color: styles.text,
                                fontSize: data.body && data.body.length > 200 ? '48px' : '56px'
                            }}
                        >
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'highlight' && (
                    <div className="dramatic-highlight-wrapper">
                        <div
                            className="dramatic-quote-mark"
                            style={{ color: styles.accent }}
                        >
                            "
                        </div>
                        <h2
                            className="dramatic-highlight-text"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h2>
                        <p
                            className="dramatic-highlight-detail"
                            style={{ color: styles.secondary }}
                        >
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="dramatic-cta-wrapper">
                        <h2
                            className="dramatic-cta-title"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h2>
                        <div
                            className="dramatic-cta-box"
                            style={{
                                borderColor: styles.accent,
                                background: `linear-gradient(180deg, ${styles.accent}20, transparent)`
                            }}
                        >
                            <p
                                className="dramatic-cta-text"
                                style={{ color: styles.text }}
                            >
                                {data.body}
                            </p>
                        </div>
                        <div
                            className="dramatic-cta-arrow"
                            style={{ color: styles.accent }}
                        >
                            ↓
                        </div>
                        {sourceDomain && (
                            <div
                                className="dramatic-source"
                                style={{ color: styles.muted }}
                            >
                                Fonte: {sourceDomain}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Progress */}
            <div className="dramatic-dark-footer">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className="dramatic-progress-dot"
                        style={{
                            background: i <= index ? styles.accent : styles.muted,
                            transform: i === index ? 'scale(1.5)' : 'scale(1)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
