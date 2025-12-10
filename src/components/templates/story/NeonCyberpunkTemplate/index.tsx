/**
 * Neon Cyberpunk Template - Design futurista com neon
 * 
 * Características:
 * - Fundo escuro com gradientes neon pink/purple
 * - Efeitos de glow em textos e bordas
 * - Tipografia tech/monospace em pontos-chave
 * - Tamanhos de texto que variam para criar ritmo
 */

import React from 'react';
import { StoryTemplateProps } from '../index';
import './styles.css';

export function NeonCyberpunkTemplate({
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
            className="neon-cyber-container"
            style={{
                transform: `scale(${scale})`,
                background: styles.background,
            }}
        >
            {/* Neon Background Effects */}
            <div className="neon-cyber-bg" />
            <div className="neon-cyber-grid" />
            <div className="neon-cyber-glow-orb orb-1" />
            <div className="neon-cyber-glow-orb orb-2" />

            {/* Header minimalista */}
            <div className="neon-cyber-header" />

            {/* Content */}
            <div className="neon-cyber-content">
                {data.type === 'cover' && (
                    <div className="neon-cover-wrapper">
                        <div className="neon-glitch-container">
                            <h1
                                className="neon-title-glitch"
                                data-text={data.title}
                                style={{
                                    color: styles.text,
                                    textShadow: `0 0 40px ${styles.accent}`
                                }}
                            >
                                {data.title}
                            </h1>
                        </div>
                        <div
                            className="neon-separator"
                            style={{ background: `linear-gradient(90deg, transparent, ${styles.accent}, ${styles.secondary}, transparent)` }}
                        />
                        <h2
                            className="neon-subtitle"
                            style={{ color: styles.secondary }}
                        >
                            {data.subtitle}
                        </h2>
                    </div>
                )}

                {data.type === 'content' && (
                    <div className="neon-content-wrapper">
                        <h2
                            className="neon-content-title"
                            style={{
                                color: styles.accent,
                                textShadow: `0 0 30px ${styles.accent}80`
                            }}
                        >
                            {data.title}
                        </h2>
                        <div
                            className="neon-content-card"
                            style={{
                                borderColor: styles.accent,
                                background: `linear-gradient(180deg, ${styles.accent}10, transparent)`
                            }}
                        >
                            <p
                                className="neon-content-body"
                                style={{ color: styles.text }}
                            >
                                {data.body?.split(' ').map((word, i) => (
                                    <span
                                        key={i}
                                        className={i % 7 === 0 ? 'neon-word-glow' : ''}
                                        style={i % 7 === 0 ? { color: styles.accent } : {}}
                                    >
                                        {word}{' '}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                )}

                {data.type === 'highlight' && (
                    <div className="neon-highlight-wrapper">
                        <div
                            className="neon-highlight-box"
                            style={{
                                borderColor: styles.secondary,
                                boxShadow: `0 0 60px ${styles.secondary}30, inset 0 0 60px ${styles.secondary}10`
                            }}
                        >
                            <span
                                className="neon-highlight-label"
                                style={{
                                    color: styles.accent,
                                    background: '#0a0a0f'
                                }}
                            >
                                DESTAQUE
                            </span>
                            <h2
                                className="neon-highlight-text"
                                style={{ color: styles.text }}
                            >
                                {data.title}
                            </h2>
                            <p
                                className="neon-highlight-detail"
                                style={{ color: styles.secondary }}
                            >
                                {data.body}
                            </p>
                        </div>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="neon-cta-wrapper">
                        <h2
                            className="neon-cta-title"
                            style={{
                                color: styles.text,
                                textShadow: `0 0 20px ${styles.accent}50`
                            }}
                        >
                            {data.title}
                        </h2>
                        <div
                            className="neon-cta-button"
                            style={{
                                background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})`,
                                boxShadow: `0 0 40px ${styles.accent}60`
                            }}
                        >
                            <p className="neon-cta-text">
                                {data.body}
                            </p>
                        </div>
                        <div
                            className="neon-cta-hint"
                            style={{ color: styles.muted }}
                        >
                            <span className="neon-blink">▼</span> Interaja <span className="neon-blink">▼</span>
                        </div>
                        {sourceDomain && (
                            <div
                                className="neon-source"
                                style={{ color: styles.muted }}
                            >
                                via {sourceDomain}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Progress - Line Style */}
            <div className="neon-cyber-footer">
                <div
                    className="neon-progress-track"
                    style={{ background: styles.muted }}
                >
                    <div
                        className="neon-progress-fill"
                        style={{
                            width: `${((index + 1) / total) * 100}%`,
                            background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary})`,
                            boxShadow: `0 0 20px ${styles.accent}`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
