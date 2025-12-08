/**
 * Tweet News Template - Design estilo Twitter com imagem de notícia
 * 
 * Características:
 * - Fundo branco puro
 * - Avatar pequeno + nome + selo verificado
 * - Suporte a imagem de notícia no slide cover
 * - Texto em parágrafos separados nos demais slides
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck } from 'lucide-react';
import './styles.css';

// Extende as props para incluir campo de imagem opcional
interface TweetNewsData {
    type: string;
    title: string;
    subtitle?: string;
    body?: string;
    image?: string; // URL da imagem de notícia (upload do usuário)
}

interface TweetNewsTemplateProps extends Omit<CarouselTemplateProps, 'data'> {
    data: TweetNewsData;
}

export function TweetNewsTemplate({
    data,
    index,
    total,
    id,
    profile,
    theme,
    scale = 1
}: TweetNewsTemplateProps) {
    const { styles } = theme;

    return (
        <div
            id={id}
            className="tweet-news-slide"
            style={{
                background: styles.background,
                color: styles.text,
                transform: `scale(${scale})`,
            }}
        >
            {/* Wrapper que centraliza header + conteúdo como bloco único */}
            <div className="tweet-news-main-wrapper">
                <div className="tweet-news-unified-block">
                    {/* Header - Avatar + Nome + Selo */}
                    <div className="tweet-news-header">
                        <div className="tweet-news-profile">
                            <div className="tweet-news-avatar-wrapper">
                                {profile.image ? (
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        className="tweet-news-avatar-img"
                                    />
                                ) : (
                                    <div
                                        className="tweet-news-avatar-placeholder"
                                        style={{ background: styles.muted }}
                                    >
                                        {profile.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span className="tweet-news-name" style={{ color: styles.text }}>
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
                    <div className="tweet-news-content">
                        {/* Cover - Com texto introdutório e imagem de notícia */}
                        {data.type === 'cover' && (
                            <div className="tweet-news-cover-content">
                                {/* Texto introdutório */}
                                <p className="tweet-news-intro-text" style={{ color: styles.text }}>
                                    {data.title}
                                </p>
                                {data.subtitle && (
                                    <p className="tweet-news-secondary-text" style={{ color: styles.text }}>
                                        {data.subtitle}
                                    </p>
                                )}

                                {/* Imagem de notícia (se existir) */}
                                {data.image && (
                                    <div className="tweet-news-image-container">
                                        <img
                                            src={data.image}
                                            alt="Notícia"
                                            className="tweet-news-image"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content/Highlight - Parágrafos de texto */}
                        {(data.type === 'content' || data.type === 'highlight') && (
                            <div className="tweet-news-body-content">
                                {data.title && (
                                    <p className="tweet-news-paragraph" style={{ color: styles.text }}>
                                        {data.title}
                                    </p>
                                )}
                                {data.body && (
                                    <p className="tweet-news-paragraph" style={{ color: styles.text }}>
                                        {data.body}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* CTA - Chamada para ação */}
                        {data.type === 'cta' && (
                            <div className="tweet-news-cta-content">
                                <p className="tweet-news-paragraph" style={{ color: styles.text }}>
                                    {data.title}
                                </p>
                                {data.body && (
                                    <p className="tweet-news-paragraph tweet-news-cta-emphasis" style={{ color: styles.text }}>
                                        {data.body}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer - Contador de slides */}
            <div className="tweet-news-footer">
                <span className="tweet-news-counter" style={{ color: styles.secondary }}>
                    {index + 1}/{total}
                </span>
            </div>
        </div>
    );
}
