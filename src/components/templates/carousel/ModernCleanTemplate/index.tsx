/**
 * ModernClean Template - Tema claro minimalista
 * 
 * Características únicas:
 * - Fundo claro, texto escuro (contraste invertido)
 * - Layout que VARIA a cada slide
 * - Cover: Minimalista com linha decorativa
 * - Slides pares: Quote style com aspas
 * - Slides ímpares: Numbered com ícone de número
 * - CTA: Botão arredondado destacado
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck, Quote } from 'lucide-react';
import './styles.css';

export function ModernCleanTemplate({
    data,
    index,
    total,
    id,
    profile,
    theme,
    scale = 1
}: CarouselTemplateProps) {
    const { styles } = theme;
    const isEven = index % 2 === 0;
    const contentNumber = index; // Para exibir número do slide no conteúdo

    return (
        <div
            id={id}
            className="modern-slide"
            style={{
                background: styles.background,
                color: styles.text,
                transform: `scale(${scale})`,
            }}
        >
            {/* Decorative Corner Element */}
            <div className="modern-corner-decoration" style={{ background: styles.accent }} />

            {/* Header - Minimalista */}
            <div className="modern-header">
                <div className="modern-profile">
                    <div className="modern-avatar-wrapper" style={{ borderColor: styles.border }}>
                        {profile.image ? (
                            <img src={profile.image} alt="Profile" className="modern-avatar-img" />
                        ) : (
                            <div className="modern-avatar-placeholder" style={{ background: styles.accent, color: 'white' }}>
                                {profile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="modern-profile-info">
                        <div className="modern-name-row">
                            <span className="modern-name">{profile.name}</span>
                            <BadgeCheck size={28} fill="#1d9bf0" color="white" />
                        </div>
                        <span className="modern-handle" style={{ color: styles.secondary }}>{profile.handle}</span>
                    </div>
                </div>
                <div className="modern-counter" style={{ color: styles.secondary }}>
                    <span style={{ color: styles.accent, fontWeight: 700 }}>{index + 1}</span>
                    <span> / {total}</span>
                </div>
            </div>

            {/* Content - Layout varia por tipo e índice */}
            <div className="modern-content">

                {/* COVER - Minimalista e clean */}
                {data.type === 'cover' && (
                    <div className="modern-cover">
                        <div className="modern-cover-line" style={{ background: styles.accent }} />
                        <h1 className="modern-cover-title">
                            {data.title}
                        </h1>
                        <p className="modern-cover-subtitle" style={{ color: styles.secondary }}>
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {/* CONTENT - Layout alterna entre estilos */}
                {(data.type === 'content' || data.type === 'highlight') && (
                    <>
                        {isEven ? (
                            /* Layout A: Quote style com aspas grandes */
                            <div className="modern-body-quote">
                                <div className="modern-quote-icon" style={{ color: styles.accent }}>
                                    <Quote size={80} />
                                </div>
                                <h2 className="modern-quote-title">
                                    {data.title}
                                </h2>
                                <p className="modern-quote-text" style={{ color: styles.secondary }}>
                                    {data.body}
                                </p>
                                <div className="modern-quote-line" style={{ background: styles.accent }} />
                            </div>
                        ) : (
                            /* Layout B: Numbered com número grande */
                            <div className="modern-body-numbered">
                                <div className="modern-number-badge" style={{
                                    background: styles.accent,
                                    color: 'white'
                                }}>
                                    {String(contentNumber).padStart(2, '0')}
                                </div>
                                <h2 className="modern-numbered-title">
                                    {data.title}
                                </h2>
                                <div className="modern-numbered-divider" style={{ background: styles.border }} />
                                <p className="modern-numbered-text" style={{ color: styles.secondary }}>
                                    {data.body}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* CTA - Clean com botão destacado */}
                {data.type === 'cta' && (
                    <div className="modern-cta">
                        <h2 className="modern-cta-title">
                            {data.title}
                        </h2>
                        <p className="modern-cta-text" style={{ color: styles.secondary }}>
                            {data.body}
                        </p>
                        <div className="modern-cta-button" style={{
                            background: styles.accent,
                            color: 'white'
                        }}>
                            SEGUIR →
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Linha simples */}
            <div className="modern-footer">
                <div className="modern-footer-line" style={{ background: styles.border }} />
            </div>
        </div>
    );
}
