import React from 'react';

interface StoryTemplateProps {
    data: {
        type: string;
        title: string;
        subtitle?: string;
        body?: string;
    };
    index: number;
    total: number;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
}

export function BreakingNewsTemplate({ data, index, total, profile }: StoryTemplateProps) {
    return (
        <div className="breaking-news-container">
            {/* Background Element */}
            <div className="breaking-news-bg" />

            {/* Header */}
            <div className="breaking-news-header">
                <div className="breaking-news-profile">
                    {profile.image && (
                        <img
                            src={profile.image}
                            alt="Profile"
                            className="breaking-news-avatar"
                        />
                    )}
                    <div>
                        <div className="breaking-news-name">{profile.name}</div>
                        <div className="breaking-news-handle">{profile.handle}</div>
                    </div>
                </div>
                <div className="breaking-news-badge">
                    News
                </div>
            </div>

            {/* Content */}
            <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {data.type === 'cover' && (
                    <>
                        <div className="breaking-news-urgent">
                            URGENTE
                        </div>
                        <h1 className="breaking-news-title-cover">
                            {data.title}
                        </h1>
                        <h2 className="breaking-news-subtitle">
                            {data.subtitle}
                        </h2>
                    </>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <>
                        <h2 className="breaking-news-title-content">
                            {data.title}
                        </h2>
                        <p className="breaking-news-body">
                            {data.body}
                        </p>
                    </>
                )}

                {data.type === 'cta' && (
                    <div className="breaking-news-cta-container">
                        <h2 className="breaking-news-cta-title">
                            {data.title}
                        </h2>
                        <div className="breaking-news-cta-box">
                            <p className="breaking-news-cta-text">
                                {data.body}
                            </p>
                            <div className="breaking-news-cta-footer">
                                👇 Responda abaixo
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Progress */}
            <div className="breaking-news-footer">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`breaking-news-progress ${i <= index ? 'active' : 'inactive'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export function ModernStoryTemplate({ data, index, total, profile }: StoryTemplateProps) {
    return (

        <div className="modern-story-container">
            {/* Background Gradient */}
            <div className="modern-story-bg" />

            {/* Header */}
            <div className="modern-story-header">
                {profile.image && (
                    <img
                        src={profile.image}
                        alt="Profile"
                        className="modern-story-avatar"
                    />
                )}
                <div>
                    <div className="modern-story-name">{profile.name}</div>
                    <div className="modern-story-handle">{profile.handle}</div>
                </div>
            </div>

            {/* Content */}
            <div className="modern-story-content">
                {data.type === 'cover' && (
                    <>
                        <h1 className="modern-story-title-cover">
                            {data.title}
                        </h1>
                        <div className="modern-story-separator" />
                        <h2 className="modern-story-subtitle">
                            {data.subtitle}
                        </h2>
                    </>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <div className="modern-story-card">
                        <h2 className="modern-story-title-content">
                            {data.title}
                        </h2>
                        <p className="modern-story-body">
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div className="modern-story-cta-container">
                        <h2 className="modern-story-cta-title">
                            {data.title}
                        </h2>
                        <div className="modern-story-cta-box">
                            <p className="modern-story-cta-text">
                                {data.body}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Progress */}
            <div className="modern-story-footer">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`modern-story-progress ${i <= index ? 'active' : 'inactive'}`}
                    />
                ))}
            </div>
        </div>
    );
}
