/**
 * FinancialDark Template - Tema padrão profissional
 * 
 * Características únicas:
 * - Layout que VARIA a cada slide (alternando estilos)
 * - Cover: Grande e impactante
 * - Slides pares: Texto à esquerda com barra accent
 * - Slides ímpares: Texto centralizado com card
 * - CTA: Box destacado
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck, TrendingUp } from 'lucide-react';
import './styles.css';

export function FinancialDarkTemplate({
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

    return (
        <div
            id={id}
            className="financial-slide"
            style={{
                background: styles.background,
                transform: `scale(${scale})`,
            }}
        >
            {/* Header */}
            <div className="financial-header">
                <div className="financial-profile">
                    <div className="financial-avatar-wrapper" style={{ borderColor: styles.accent }}>
                        {profile.image ? (
                            <img src={profile.image} alt="Profile" className="financial-avatar-img" />
                        ) : (
                            <div className="financial-avatar-placeholder" style={{ background: styles.border }}>
                                {profile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="financial-profile-info">
                        <div className="financial-name-row">
                            <span className="financial-name">{profile.name}</span>
                            <BadgeCheck size={30} fill="#1d9bf0" color="white" />
                        </div>
                        <span className="financial-handle" style={{ color: styles.secondary }}>{profile.handle}</span>
                    </div>
                </div>
                <div className="financial-counter" style={{ background: styles.border, color: styles.accent }}>
                    {index + 1}/{total}
                </div>
            </div>

            {/* Content - Layout varia por tipo e índice */}
            <div className="financial-content">

                {/* COVER - Layout especial grande */}
                {data.type === 'cover' && (
                    <div className="financial-cover">
                        <div className="financial-cover-icon" style={{ color: styles.accent }}>
                            <TrendingUp size={60} />
                        </div>
                        <h1 className="financial-cover-title">
                            {data.title}
                        </h1>
                        <div className="financial-cover-divider" style={{ background: styles.accent }} />
                        <p className="financial-cover-subtitle" style={{ color: styles.secondary }}>
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {/* CONTENT - Layout alterna entre estilos */}
                {(data.type === 'content' || data.type === 'highlight') && (
                    <>
                        {isEven ? (
                            /* Layout A: Barra lateral + texto alinhado à esquerda */
                            <div className="financial-body-left">
                                <div className="financial-body-bar" style={{ background: styles.accent }} />
                                <div className="financial-body-text-container">
                                    <h2 className="financial-body-title" style={{ color: styles.accent }}>
                                        {data.title}
                                    </h2>
                                    <p className="financial-body-text" style={{ color: styles.secondary }}>
                                        {data.body}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Layout B: Card centralizado */
                            <div className="financial-body-card-layout">
                                <div className="financial-body-card" style={{
                                    background: styles.border,
                                    borderColor: styles.accent
                                }}>
                                    <div className="financial-card-accent-top" style={{ background: styles.accent }} />
                                    <h2 className="financial-card-title">
                                        {data.title}
                                    </h2>
                                    <p className="financial-card-text" style={{ color: styles.secondary }}>
                                        {data.body}
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* CTA - Layout especial */}
                {data.type === 'cta' && (
                    <div className="financial-cta">
                        <h2 className="financial-cta-title" style={{ color: styles.accent }}>
                            {data.title}
                        </h2>
                        <div className="financial-cta-box" style={{
                            background: `linear-gradient(135deg, ${styles.accent}20, ${styles.border})`,
                            borderColor: styles.accent
                        }}>
                            <p className="financial-cta-text">
                                {data.body}
                            </p>
                        </div>
                        <div className="financial-cta-button" style={{ background: styles.accent }}>
                            SEGUIR
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Gradient bar */}
            <div className="financial-footer" style={{
                background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary})`
            }} />
        </div>
    );
}
