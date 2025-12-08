/**
 * SunsetVibes Template - Design vibrante e energético
 * 
 * Características únicas:
 * - Cores quentes vibrantes (laranja, rosa, amarelo)
 * - Fonte Poppins bold e arredondada
 * - Formas geométricas dinâmicas
 * - Estilo jovem e moderno
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck, Sparkles } from 'lucide-react';
import './styles.css';

export function SunsetVibesTemplate({
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
            className="sunset-slide"
            style={{
                background: styles.background,
                transform: `scale(${scale})`,
            }}
        >
            {/* Dynamic Background Shapes */}
            <div className="sunset-shape sunset-shape-1" style={{ background: `${styles.accent}30` }} />
            <div className="sunset-shape sunset-shape-2" style={{ background: `${styles.secondary}40` }} />
            <div className="sunset-shape sunset-shape-3" style={{ background: `${styles.muted}60` }} />

            {/* Header */}
            <div className="sunset-header">
                <div className="sunset-profile">
                    <div className="sunset-avatar-wrapper" style={{
                        background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})`,
                        padding: '4px'
                    }}>
                        <div className="sunset-avatar-inner">
                            {profile.image ? (
                                <img src={profile.image} alt="Profile" className="sunset-avatar-img" />
                            ) : (
                                <div className="sunset-avatar-placeholder">
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="sunset-profile-info">
                        <div className="sunset-name-row">
                            <span className="sunset-name">{profile.name}</span>
                            <BadgeCheck size={30} fill="#1d9bf0" color="white" />
                        </div>
                        <span className="sunset-handle" style={{ color: 'rgba(255,255,255,0.8)' }}>{profile.handle}</span>
                    </div>
                </div>
                <div className="sunset-counter" style={{
                    background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})`
                }}>
                    {index + 1}/{total}
                </div>
            </div>

            {/* Content */}
            <div className="sunset-content">
                {data.type === 'cover' && (
                    <div className="sunset-cover">
                        <div className="sunset-emoji-row">
                            <Sparkles size={50} style={{ color: styles.accent }} />
                        </div>
                        <h1 className="sunset-title">
                            {data.title}
                        </h1>
                        <div className="sunset-pill-divider" style={{
                            background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary})`
                        }} />
                        <p className="sunset-subtitle">
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <div className="sunset-body-container">
                        <div className="sunset-body-badge" style={{
                            background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})`
                        }}>
                            <Sparkles size={24} />
                            <span>{data.title}</span>
                        </div>
                        <div className="sunset-body-card" style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)'
                        }}>
                            <p className="sunset-body-text">
                                {data.body}
                            </p>
                        </div>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="sunset-cta">
                        <h2 className="sunset-cta-title">
                            {data.title}
                        </h2>
                        <p className="sunset-cta-text">
                            {data.body}
                        </p>
                        <div className="sunset-cta-button" style={{
                            background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})`,
                        }}>
                            🚀 SEGUIR
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Wave */}
            <div className="sunset-footer">
                <svg viewBox="0 0 1080 80" className="sunset-wave" preserveAspectRatio="none">
                    <path
                        d="M0,40 C360,80 720,0 1080,40 L1080,80 L0,80 Z"
                        fill={styles.accent}
                        opacity="0.6"
                    />
                    <path
                        d="M0,50 C360,90 720,10 1080,50 L1080,80 L0,80 Z"
                        fill={styles.secondary}
                        opacity="0.4"
                    />
                </svg>
            </div>
        </div>
    );
}
