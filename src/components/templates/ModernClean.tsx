import './styles/ModernClean.css';
import React from 'react';
import { User, ArrowRight, BadgeCheck } from 'lucide-react';

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

export function ModernClean({ data, index, total, id, profile, scale = 0.4 }: SlideProps) {
    return (
        <div
            id={id}
            className="slide-container modern-clean-container"
            style={{
                transform: `scale(${scale})`,
            }}
        >
            {/* Decorative Circle */}
            <div className="modern-clean-circle" />

            {/* Header */}
            <div className="modern-clean-header">
                <div className="modern-clean-profile-group">
                    <div className="modern-clean-avatar-wrapper">
                        {profile.image ? (
                            <img
                                src={profile.image}
                                alt="Profile"
                                className="modern-clean-avatar-img"
                            />
                        ) : (
                            <div className="modern-clean-avatar-placeholder">
                                <User size={40} color="#64748b" />
                            </div>
                        )}
                    </div>
                    <div className="modern-clean-profile-info">
                        <div className="modern-clean-name-wrapper">
                            <p className="modern-clean-name">{profile.name}</p>
                            <BadgeCheck size={40} fill="#1d9bf0" color="white" />
                        </div>
                        <p className="modern-clean-handle">{profile.handle}</p>
                    </div>
                </div>
                <div className="modern-clean-index">
                    {index + 1} / {total}
                </div>
            </div>

            {/* Content */}
            <div className="modern-clean-content">
                {data.type === 'cover' && (
                    <div className="modern-clean-cover-container">
                        <div className="modern-clean-tag">
                            NOVO POST
                        </div>
                        <h1 className="modern-clean-title-cover">
                            {data.title}
                        </h1>
                        <p className="modern-clean-subtitle">
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {data.type === 'content' && (
                    <div>
                        <h2 className="modern-clean-title-content">
                            {data.title}
                        </h2>
                        <div className="modern-clean-body">
                            {data.body}
                        </div>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="modern-clean-cta-container">
                        <h2 className="modern-clean-cta-title">
                            {data.title}
                        </h2>
                        <p className="modern-clean-cta-body">
                            {data.body}
                        </p>
                        <div className="modern-clean-cta-btn-wrapper">
                            <div className="modern-clean-cta-btn">
                                Salvar Post <ArrowRight size={36} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Decorative Line */}
            <div className="modern-clean-footer-line" />
        </div>
    );
}
