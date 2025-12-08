/**
 * Modern Story Template - Design clean e minimalista
 * 
 * Características:
 * - Fundo claro com gradiente suave
 * - Tipografia moderna e limpa
 * - Cards com sombra para conteúdo
 * - Progress bar no footer
 */

import React from 'react';
import { StoryTemplateProps } from '../index';
import './styles.css';

export function ModernStoryTemplate({
    data,
    index,
    total,
    id,
    profile,
    theme,
    scale = 1
}: StoryTemplateProps) {
    const { styles } = theme;

    return (
        <div
            id={id}
            className="modern-story-container"
            style={{
                transform: `scale(${scale})`,
                background: styles.background,
                color: styles.text,
            }}
        >
            {/* Background Gradient */}
            <div
                className="modern-story-bg"
                style={{ background: styles.background }}
            />

            {/* Header */}
            <div className="modern-story-header">
                {/* Nome e @handle removidos - Instagram já exibe */}
            </div>

            {/* Content */}
            <div className="modern-story-content">
                {data.type === 'cover' && (
                    <>
                        <h1
                            className="modern-story-title-cover"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h1>
                        <div
                            className="modern-story-separator"
                            style={{ background: styles.accent }}
                        />
                        <h2
                            className="modern-story-subtitle"
                            style={{ color: styles.secondary }}
                        >
                            {data.subtitle}
                        </h2>
                    </>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <div
                        className="modern-story-card"
                        style={{
                            background: 'white',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <h2
                            className="modern-story-title-content"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h2>
                        <p
                            className="modern-story-body"
                            style={{ color: styles.secondary }}
                        >
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="modern-story-cta-container">
                        <h2
                            className="modern-story-cta-title"
                            style={{ color: styles.text }}
                        >
                            {data.title}
                        </h2>
                        <div
                            className="modern-story-cta-box"
                            style={{
                                background: styles.accent,
                                color: 'white'
                            }}
                        >
                            <p className="modern-story-cta-text">
                                {data.body}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Progress */}
            <div className="modern-story-footer">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className="modern-story-progress"
                        style={{
                            background: i <= index ? styles.accent : styles.muted
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
