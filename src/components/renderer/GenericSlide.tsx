import React from 'react';
import { Theme } from '@/types/theme';
import { BadgeCheck } from 'lucide-react';

interface GenericSlideProps {
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
    theme: Theme;
    scale?: number;
}

export function GenericSlide({ data, index, total, id, profile, theme, scale = 1 }: GenericSlideProps) {
    const { styles, layout } = theme;
    const isStory = theme.type === 'story';

    const width = isStory ? '1080px' : '1080px';
    const height = isStory ? '1920px' : '1350px';

    return (
        <div
            id={id}
            className="generic-slide-container"
            style={{
                width,
                height,
                background: styles.background,
                color: styles.text,
                fontFamily: styles.fontFamily,
                transform: `scale(${scale})`,
            }}
        >
            {/* --- HEADER --- */}
            {layout.header !== 'none' && (
                <div className="generic-slide-header">
                    {layout.header === 'twitter' && (
                        <div className="generic-slide-item-group">
                            <div className="generic-slide-avatar-wrapper" style={{ backgroundColor: styles.border }}>
                                {profile.image ? (
                                    <img src={profile.image} alt="Profile" className="generic-slide-avatar-img" />
                                ) : (
                                    <div className="generic-slide-avatar-placeholder">{profile.name.charAt(0)}</div>
                                )}
                            </div>
                            <div>
                                <div className="generic-slide-info-row">
                                    <span className="generic-slide-name">{profile.name}</span>
                                    <BadgeCheck size={40} fill="#1d9bf0" color="white" />
                                </div>
                                <span className="generic-slide-handle" style={{ color: styles.secondary }}>{profile.handle}</span>
                            </div>
                        </div>
                    )}

                    {layout.header === 'minimal' && (
                        <div className="generic-slide-item-group">
                            {profile.image && (
                                <img src={profile.image} alt="Profile" style={{ width: isStory ? '140px' : '80px', height: isStory ? '140px' : '80px', borderRadius: '50%', border: `4px solid ${styles.text}`, objectFit: 'cover' }} />
                            )}
                            <div>
                                <div style={{ fontSize: isStory ? '42px' : '28px', fontWeight: 'bold' }}>{profile.name}</div>
                                <div style={{ fontSize: isStory ? '36px' : '24px', color: styles.secondary }}>{profile.handle}</div>
                            </div>
                        </div>
                    )}

                    {layout.header === 'news' && (
                        <>
                            <div className="generic-slide-item-group">
                                {profile.image && (
                                    <img src={profile.image} alt="Profile" style={{ width: '140px', height: '140px', borderRadius: '50%', border: `6px solid ${styles.accent}`, objectFit: 'cover' }} />
                                )}
                                <div>
                                    <div className="generic-slide-name" style={{ fontSize: '42px' }}>{profile.name}</div>
                                    <div className="generic-slide-handle" style={{ fontSize: '36px', color: styles.secondary }}>{profile.handle}</div>
                                </div>
                            </div>
                            <div className="generic-slide-badge-news" style={{ background: styles.accent, color: 'white' }}>
                                News
                            </div>
                        </>
                    )}

                    {/* Counter for Carousel */}
                    {!isStory && layout.header !== 'news' && (
                        <div className="generic-slide-counter">{index + 1}/{total}</div>
                    )}
                </div>
            )}

            {/* --- CONTENT --- */}
            <div className="generic-slide-content-wrapper">

                {/* COVER LAYOUTS */}
                {data.type === 'cover' && (
                    <>
                        {layout.cover === 'centered' && (
                            <div style={{ textAlign: 'center' }}>
                                <h1 className="generic-slide-title-centered">{data.title}</h1>
                                <p className="generic-slide-subtitle-centered" style={{ color: styles.accent }}>{data.subtitle}</p>
                            </div>
                        )}
                        {layout.cover === 'big-bold' && (
                            <div>
                                <h1 style={{ fontSize: isStory ? '100px' : '120px', fontWeight: 900, lineHeight: 1, marginBottom: '40px', letterSpacing: '-2px' }}>{data.title}</h1>
                                <div style={{ width: '100px', height: '10px', background: styles.accent, marginBottom: '40px' }} />
                                <p style={{ fontSize: '48px', color: styles.secondary }}>{data.subtitle}</p>
                            </div>
                        )}
                        {layout.cover === 'news-headline' && (
                            <div>
                                <div className="generic-slide-urgent-tag" style={{ background: styles.accent, color: 'white' }}>URGENTE</div>
                                <h1 style={{ fontSize: '110px', fontWeight: 900, lineHeight: 1.1, marginBottom: '40px' }}>{data.title}</h1>
                                <h2 style={{ fontSize: '48px', color: styles.secondary, fontWeight: 'normal' }}>{data.subtitle}</h2>
                            </div>
                        )}
                        {layout.cover === 'minimal' && (
                            <div>
                                <h1 style={{ fontSize: '100px', fontWeight: 800, lineHeight: 1.1, marginBottom: '60px', letterSpacing: '-2px' }}>{data.title}</h1>
                                <div style={{ width: '100px', height: '10px', background: styles.text, marginBottom: '60px' }} />
                                <h2 style={{ fontSize: '48px', color: styles.secondary, fontWeight: 'normal', lineHeight: 1.4 }}>{data.subtitle}</h2>
                            </div>
                        )}
                    </>
                )}

                {/* BODY LAYOUTS */}
                {(data.type === 'content' || data.type === 'highlight') && (
                    <>
                        {layout.content === 'standard' && (
                            <div>
                                <h2 style={{ fontSize: '64px', marginBottom: '60px', color: styles.accent, borderLeft: `10px solid ${styles.accent}`, paddingLeft: '40px' }}>{data.title}</h2>
                                <p style={{ fontSize: '42px', lineHeight: 1.4, color: styles.secondary, whiteSpace: 'pre-wrap' }}>{data.body}</p>
                            </div>
                        )}
                        {layout.content === 'card' && (
                            <div style={{ background: isStory ? 'white' : styles.border, padding: '60px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                                <h2 style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '40px', color: isStory ? 'black' : styles.text }}>{data.title}</h2>
                                <p style={{ fontSize: isStory ? '52px' : '42px', lineHeight: 1.5, color: isStory ? '#333' : styles.secondary }}>{data.body}</p>
                            </div>
                        )}
                        {layout.content === 'news-body' && (
                            <>
                                <h2 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '60px', color: styles.accent }}>{data.title}</h2>
                                <p style={{ fontSize: '56px', lineHeight: 1.4 }}>{data.body}</p>
                            </>
                        )}
                    </>
                )}

                {/* CTA LAYOUTS */}
                {data.type === 'cta' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '72px', marginBottom: '40px', color: styles.accent }}>{data.title}</h2>
                        {layout.content === 'card' ? (
                            <div style={{ background: styles.text, color: styles.background, padding: '60px', borderRadius: '40px' }}>
                                <p style={{ fontSize: '52px', fontWeight: 'bold' }}>{data.body}</p>
                            </div>
                        ) : (
                            <p style={{ fontSize: '48px', marginBottom: '80px' }}>{data.body}</p>
                        )}

                        {!isStory && layout.content !== 'card' && (
                            <div style={{ display: 'inline-block', padding: '30px 60px', backgroundColor: styles.accent, color: styles.background, fontSize: '48px', fontWeight: 'bold', borderRadius: '20px' }}>SALVAR</div>
                        )}
                    </div>
                )}
            </div>

            {/* --- FOOTER --- */}
            <div style={{ zIndex: 1, marginTop: 'auto' }}>
                {layout.footer === 'bar' && (
                    <div style={{ height: '20px', background: `linear-gradient(90deg, ${styles.accent}, ${styles.secondary})` }} />
                )}
                {layout.footer === 'progress' && (
                    <div className="generic-slide-footer-progress">
                        {Array.from({ length: total }).map((_, i) => (
                            <div key={i} className="generic-slide-progress-bar" style={{ background: i <= index ? styles.accent : styles.muted }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
