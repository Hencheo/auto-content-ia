/**
 * LuxuryGold Template - Design premium elegante
 * 
 * Características únicas:
 * - Fonte serifada elegante (Playfair Display)
 * - Decorações douradas ornamentais
 * - Layout clássico e sofisticado
 * - Bordas e elementos com gold gradient
 */

import React from 'react';
import { CarouselTemplateProps } from '../index';
import { BadgeCheck, Crown } from 'lucide-react';
import './styles.css';

export function LuxuryGoldTemplate({
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
            className="luxury-slide"
            style={{
                background: styles.background,
                transform: `scale(${scale})`,
            }}
        >
            {/* Decorative Corner Ornaments */}
            <div className="luxury-corner luxury-corner-tl" style={{ borderColor: styles.accent }} />
            <div className="luxury-corner luxury-corner-tr" style={{ borderColor: styles.accent }} />
            <div className="luxury-corner luxury-corner-bl" style={{ borderColor: styles.accent }} />
            <div className="luxury-corner luxury-corner-br" style={{ borderColor: styles.accent }} />

            {/* Header */}
            <div className="luxury-header">
                <div className="luxury-profile">
                    <div className="luxury-avatar-wrapper" style={{ borderColor: styles.accent }}>
                        {profile.image ? (
                            <img src={profile.image} alt="Profile" className="luxury-avatar-img" />
                        ) : (
                            <div className="luxury-avatar-placeholder" style={{ background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})` }}>
                                {profile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="luxury-profile-info">
                        <div className="luxury-name-row">
                            <span className="luxury-name" style={{ color: styles.accent }}>{profile.name}</span>
                            <BadgeCheck size={28} fill="#1d9bf0" color="white" />
                        </div>
                        <span className="luxury-handle" style={{ color: styles.secondary }}>{profile.handle}</span>
                    </div>
                </div>
                <div className="luxury-counter" style={{ color: styles.accent, borderColor: styles.accent }}>
                    <Crown size={16} style={{ marginRight: '8px' }} />
                    {index + 1}/{total}
                </div>
            </div>

            {/* Ornamental Divider */}
            <div className="luxury-divider-container">
                <div className="luxury-divider" style={{ background: `linear-gradient(90deg, transparent, ${styles.accent}, transparent)` }} />
            </div>

            {/* Content */}
            <div className="luxury-content">
                {data.type === 'cover' && (
                    <div className="luxury-cover">
                        <div className="luxury-cover-ornament" style={{ color: styles.accent }}>✦</div>
                        <h1 className="luxury-title" style={{ color: styles.text }}>
                            {data.title}
                        </h1>
                        <div className="luxury-subtitle-divider" style={{ background: `linear-gradient(90deg, transparent, ${styles.accent}, transparent)` }} />
                        <p className="luxury-subtitle" style={{ color: styles.secondary }}>
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <div className="luxury-body-container">
                        <h2 className="luxury-body-title" style={{ color: styles.accent }}>
                            {data.title}
                        </h2>
                        <div className="luxury-body-card" style={{
                            borderColor: styles.accent,
                            background: 'rgba(255,255,255,0.03)'
                        }}>
                            <p className="luxury-body-text" style={{ color: styles.secondary }}>
                                {data.body}
                            </p>
                        </div>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="luxury-cta">
                        <div className="luxury-cta-ornament" style={{ color: styles.accent }}>❖</div>
                        <h2 className="luxury-cta-title" style={{ color: styles.text }}>
                            {data.title}
                        </h2>
                        <p className="luxury-cta-text" style={{ color: styles.secondary }}>
                            {data.body}
                        </p>
                        <div className="luxury-cta-button" style={{
                            background: `linear-gradient(135deg, ${styles.accent}, ${styles.secondary})`,
                            color: '#000'
                        }}>
                            SEGUIR
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Ornament */}
            <div className="luxury-footer">
                <div className="luxury-footer-line" style={{ background: `linear-gradient(90deg, transparent, ${styles.accent}, transparent)` }} />
            </div>
        </div>
    );
}
