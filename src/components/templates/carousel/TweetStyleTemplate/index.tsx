/**
 * Tweet Style Template - Design estilo Twitter/Thread
 * 
 * Características:
 * - Fundo branco puro
 * - Avatar pequeno + nome + selo verificado
 * - Texto em parágrafos separados
 * - Layout minimalista, 100% foco no texto
 * - Header e conteúdo formam um bloco unificado que se centraliza
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck } from 'lucide-react';
import './styles.css';

export function TweetStyleTemplate({
    data,
    index,
    total,
    id,
    profile,
    theme,
    scale = 1
}: CarouselTemplateProps) {
    const { styles } = theme;

    return (
        <div
            id={id}
            className="tweet-slide"
            style={{
                background: styles.background,
                color: styles.text,
                transform: `scale(${scale})`,
            }}
        >
            {/* Wrapper que centraliza header + conteúdo como bloco único */}
            <div className="tweet-main-wrapper">
                <div className="tweet-unified-block">
                    {/* Header - Avatar + Nome + Selo */}
                    <div className="tweet-header">
                        <div className="tweet-profile">
                            <div className="tweet-avatar-wrapper">
                                {profile.image ? (
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        className="tweet-avatar-img"
                                    />
                                ) : (
                                    <div
                                        className="tweet-avatar-placeholder"
                                        style={{ background: styles.muted }}
                                    >
                                        {profile.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span className="tweet-name" style={{ color: styles.text }}>
                                {profile.name}
                            </span>
                            <BadgeCheck
                                size={50}
                                fill={styles.accent}
                                color="white"
                                style={{ marginTop: '-2px', marginLeft: '-4px' }}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="tweet-content">
                        {/* Cover - Título principal */}
                        {data.type === 'cover' && (
                            <div className="tweet-cover-content">
                                <p className="tweet-intro-text" style={{ color: styles.text }}>
                                    {data.title}
                                </p>
                                {data.subtitle && (
                                    <p className="tweet-secondary-text" style={{ color: styles.text }}>
                                        {data.subtitle}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Content/Highlight - Parágrafos de texto */}
                        {(data.type === 'content' || data.type === 'highlight') && (
                            <div className="tweet-body-content">
                                {data.title && (
                                    <p className="tweet-paragraph" style={{ color: styles.text }}>
                                        {data.title}
                                    </p>
                                )}
                                {data.body && (
                                    <p className="tweet-paragraph" style={{ color: styles.text }}>
                                        {data.body}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* CTA - Chamada para ação */}
                        {data.type === 'cta' && (
                            <div className="tweet-cta-content">
                                <p className="tweet-paragraph" style={{ color: styles.text }}>
                                    {data.title}
                                </p>
                                {data.body && (
                                    <p className="tweet-paragraph tweet-cta-emphasis" style={{ color: styles.text }}>
                                        {data.body}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer - Contador de slides */}
            <div className="tweet-footer">
                <span className="tweet-counter" style={{ color: styles.secondary }}>
                    {index + 1}/{total}
                </span>
            </div>
        </div>
    );
}
