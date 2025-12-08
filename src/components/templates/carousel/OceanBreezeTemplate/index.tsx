/**
 * OceanBreeze Template - Design que convida ao swipe
 * 
 * Características únicas:
 * - Elementos que "continuam" além das bordas (indicando continuidade)
 * - Ondas decorativas que fluem horizontalmente
 * - Linhas horizontais que sugerem movimento
 * - Setas sutis indicando próximo slide
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck, ChevronRight } from 'lucide-react';
import './styles.css';

export function OceanBreezeTemplate({
    data,
    index,
    total,
    id,
    profile,
    theme,
    scale = 1
}: CarouselTemplateProps) {
    const { styles } = theme;
    const isLastSlide = index === total - 1;

    return (
        <div
            id={id}
            className="ocean-slide"
            style={{
                background: styles.background,
                transform: `scale(${scale})`,
            }}
        >
            {/* Horizontal Flow Lines - Sugerem continuidade */}
            <div className="ocean-flow-lines">
                <div className="ocean-flow-line" style={{ background: `linear-gradient(90deg, transparent, ${styles.accent}60, transparent)`, left: '-20%' }} />
                <div className="ocean-flow-line" style={{ background: `linear-gradient(90deg, transparent, ${styles.secondary}40, transparent)`, left: '-10%', animationDelay: '0.5s' }} />
                <div className="ocean-flow-line" style={{ background: `linear-gradient(90deg, transparent, ${styles.muted}30, transparent)`, left: '0%', animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <div className="ocean-header">
                <div className="ocean-profile">
                    <div className="ocean-avatar-wrapper" style={{
                        background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})`,
                        padding: '3px'
                    }}>
                        <div className="ocean-avatar-inner">
                            {profile.image ? (
                                <img src={profile.image} alt="Profile" className="ocean-avatar-img" />
                            ) : (
                                <div className="ocean-avatar-placeholder" style={{ background: styles.accent }}>
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="ocean-profile-info">
                        <div className="ocean-name-row">
                            <span className="ocean-name">{profile.name}</span>
                            <BadgeCheck size={28} fill="#1d9bf0" color="white" />
                        </div>
                        <span className="ocean-handle" style={{ color: styles.secondary }}>{profile.handle}</span>
                    </div>
                </div>

                {/* Progress dots que indicam slides */}
                <div className="ocean-progress">
                    {Array.from({ length: total }).map((_, i) => (
                        <div
                            key={i}
                            className={`ocean-progress-dot ${i === index ? 'active' : ''}`}
                            style={{
                                background: i === index ? styles.accent : `${styles.accent}40`,
                                boxShadow: i === index ? `0 0 10px ${styles.accent}` : 'none'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="ocean-content">
                {data.type === 'cover' && (
                    <div className="ocean-cover">
                        {/* Decorative wave that extends beyond edges */}
                        <div className="ocean-wave-decoration">
                            <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="ocean-wave-svg">
                                <path
                                    d="M-100,50 C100,0 300,100 500,50 C700,0 900,100 1100,50 C1300,0 1500,100 1700,50"
                                    stroke={styles.accent}
                                    strokeWidth="3"
                                    fill="none"
                                    opacity="0.5"
                                />
                            </svg>
                        </div>

                        <h1 className="ocean-title">
                            {data.title}
                        </h1>
                        <div className="ocean-title-underline" style={{ background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary})` }} />
                        <p className="ocean-subtitle" style={{ color: styles.secondary }}>
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <div className="ocean-body-container">
                        <div className="ocean-body-accent-line" style={{
                            background: `linear-gradient(180deg, ${styles.accent}, transparent)`
                        }} />
                        <h2 className="ocean-body-title" style={{ color: styles.accent }}>
                            {data.title}
                        </h2>
                        <p className="ocean-body-text" style={{ color: styles.secondary }}>
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="ocean-cta">
                        <h2 className="ocean-cta-title">
                            {data.title}
                        </h2>
                        <p className="ocean-cta-text" style={{ color: styles.secondary }}>
                            {data.body}
                        </p>
                        <div className="ocean-cta-button" style={{
                            background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary})`,
                        }}>
                            SEGUIR
                        </div>
                    </div>
                )}
            </div>

            {/* Swipe Indicator - Seta sutil na borda direita */}
            {!isLastSlide && (
                <div className="ocean-swipe-hint">
                    <div className="ocean-swipe-line" style={{ background: `linear-gradient(0deg, transparent, ${styles.accent}60, transparent)` }} />
                    <ChevronRight size={40} style={{ color: styles.accent, opacity: 0.6 }} className="ocean-swipe-arrow" />
                </div>
            )}

            {/* Bottom Wave - Extends beyond edges */}
            <div className="ocean-footer-wave">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="ocean-bottom-wave-svg">
                    <path
                        d="M-200,60 Q0,120 200,60 T600,60 T1000,60 T1400,60"
                        fill={`${styles.accent}20`}
                    />
                    <path
                        d="M-200,80 Q0,140 200,80 T600,80 T1000,80 T1400,80"
                        fill={`${styles.secondary}15`}
                    />
                </svg>
            </div>
        </div>
    );
}
