/**
 * NeonPulse Template - Design cyberpunk com efeitos neon
 * 
 * Características únicas:
 * - Texto grande e bold com efeito glow
 * - Linhas decorativas neon
 * - Layout assimétrico
 * - Animação de pulse sutil
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck } from 'lucide-react';
import './styles.css';

export function NeonPulseTemplate({
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
            className="neon-slide"
            style={{
                background: styles.background,
                transform: `scale(${scale})`,
            }}
        >
            {/* Decorative Neon Lines */}
            <div className="neon-line neon-line-top" style={{ background: styles.accent }} />
            <div className="neon-line neon-line-bottom" style={{ background: styles.secondary }} />

            {/* Corner Glow Effect */}
            <div className="neon-corner-glow" style={{ background: `radial-gradient(circle, ${styles.accent}40 0%, transparent 70%)` }} />

            {/* Header - Minimal com glow */}
            <div className="neon-header">
                <div className="neon-profile">
                    <div className="neon-avatar-wrapper" style={{ borderColor: styles.accent }}>
                        {profile.image ? (
                            <img src={profile.image} alt="Profile" className="neon-avatar-img" />
                        ) : (
                            <div className="neon-avatar-placeholder" style={{ background: styles.accent }}>
                                {profile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="neon-profile-info">
                        <span className="neon-name">{profile.name}</span>
                        <BadgeCheck size={32} fill="#1d9bf0" color="white" />
                    </div>
                </div>
                <div className="neon-counter" style={{ color: styles.accent }}>
                    {index + 1}/{total}
                </div>
            </div>

            {/* Content */}
            <div className="neon-content">
                {data.type === 'cover' && (
                    <div className="neon-cover">
                        <h1 className="neon-title" style={{ textShadow: `0 0 40px ${styles.accent}80` }}>
                            {data.title}
                        </h1>
                        <div className="neon-divider" style={{ background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary})` }} />
                        <p className="neon-subtitle" style={{ color: styles.secondary }}>
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <div className="neon-body-container">
                        <div className="neon-accent-bar" style={{ background: styles.accent }} />
                        <h2 className="neon-body-title" style={{ color: styles.accent }}>
                            {data.title}
                        </h2>
                        <p className="neon-body-text" style={{ color: styles.secondary }}>
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="neon-cta">
                        <h2 className="neon-cta-title" style={{ textShadow: `0 0 30px ${styles.accent}80` }}>
                            {data.title}
                        </h2>
                        <div className="neon-cta-box" style={{
                            borderColor: styles.accent,
                            boxShadow: `0 0 30px ${styles.accent}40, inset 0 0 30px ${styles.accent}20`
                        }}>
                            <p className="neon-cta-text">{data.body}</p>
                        </div>
                        <div className="neon-cta-button" style={{
                            background: styles.accent,
                            boxShadow: `0 0 40px ${styles.accent}80`
                        }}>
                            SEGUIR
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Gradient Bar */}
            <div className="neon-footer" style={{
                background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary}, ${styles.accent})`
            }} />
        </div>
    );
}
