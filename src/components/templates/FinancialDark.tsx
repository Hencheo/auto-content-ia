import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface SlideProps {
    data: {
        type: string;
        title: string;
        subtitle?: string;
        body?: string;
    };
    index: number;
    total: number;
    id: string;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
    scale?: number;
}

export function FinancialDark({ data, index, total, id, profile, scale = 0.4 }: SlideProps) {
    return (
        <div
            id={id}
            className="slide-container financial-dark-container"
            style={{
                transform: `scale(${scale})`,
            }}
        >
            {/* Header Estilo Twitter */}
            <div className="financial-dark-header">
                {/* Avatar */}
                <div className="financial-dark-avatar-wrapper">
                    {profile.image ? (
                        <img
                            src={profile.image}
                            alt="Profile"
                            className="financial-dark-avatar-img"
                        />
                    ) : (
                        <div className="financial-dark-avatar-placeholder">
                            {profile.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="financial-dark-info">
                    <div className="financial-dark-name-row">
                        <span className="financial-dark-name">{profile.name}</span>
                        <BadgeCheck size={40} fill="#1d9bf0" color="white" />
                    </div>
                    <span className="financial-dark-handle">{profile.handle}</span>
                </div>

                {/* Contador */}
                <div className="financial-dark-counter">
                    {index + 1}/{total}
                </div>
            </div>

            {/* Content */}
            <div className="financial-dark-content">
                {data.type === 'cover' && (
                    <div className="financial-dark-cover-container">
                        <h1 className="financial-dark-title-cover">
                            {data.title}
                        </h1>
                        <p className="financial-dark-subtitle">
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {data.type === 'content' && (
                    <div>
                        <h2 className="financial-dark-title-content">
                            {data.title}
                        </h2>
                        <p className="financial-dark-body">
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="financial-dark-cta-container">
                        <h2 className="financial-dark-cta-title">
                            {data.title}
                        </h2>
                        <p className="financial-dark-cta-body">
                            {data.body}
                        </p>
                        <div className="financial-dark-cta-btn">
                            SALVAR
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="financial-dark-footer-line" />
        </div>
    );
}
