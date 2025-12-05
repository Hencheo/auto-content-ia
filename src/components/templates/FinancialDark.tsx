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
            className="slide-container"
            style={{
                width: '1080px',
                height: '1350px', // 4:5 Aspect Ratio
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                padding: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                marginBottom: '2rem',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
            }}
        >
            {/* Header Estilo Twitter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '25px' }}>
                {/* Avatar */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#334155', // Placeholder color
                    flexShrink: 0
                }}>
                    {profile.image ? (
                        <img
                            src={profile.image}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                            {profile.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>{profile.name}</span>
                        <BadgeCheck size={40} fill="#1d9bf0" color="white" />
                    </div>
                    <span style={{ fontSize: '32px', color: 'var(--text-muted)', marginTop: '8px' }}>{profile.handle}</span>
                </div>

                {/* Contador */}
                <div style={{ marginLeft: 'auto', fontSize: '24px', opacity: 0.5 }}>
                    {index + 1}/{total}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {data.type === 'cover' && (
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '96px',
                            lineHeight: 1.1,
                            fontWeight: 800,
                            marginBottom: '40px',
                            color: 'var(--text-primary)'
                        }}>
                            {data.title}
                        </h1>
                        <p style={{
                            fontSize: '48px',
                            color: 'var(--accent-gold)',
                            fontWeight: 500
                        }}>
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {data.type === 'content' && (
                    <div>
                        <h2 style={{
                            fontSize: '64px',
                            marginBottom: '60px',
                            color: 'var(--accent-gold)',
                            borderLeft: '10px solid var(--accent-green)',
                            paddingLeft: '40px'
                        }}>
                            {data.title}
                        </h2>
                        <p style={{
                            fontSize: '42px',
                            lineHeight: 1.4,
                            color: 'var(--text-secondary)',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '72px', marginBottom: '40px', color: 'var(--accent-green)' }}>
                            {data.title}
                        </h2>
                        <p style={{ fontSize: '48px', marginBottom: '80px' }}>
                            {data.body}
                        </p>
                        <div style={{
                            display: 'inline-block',
                            padding: '30px 60px',
                            backgroundColor: 'var(--accent-gold)',
                            color: 'var(--bg-primary)',
                            fontSize: '48px',
                            fontWeight: 'bold',
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            SALVAR
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{ height: '20px', background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-green))', marginTop: 'auto' }} />
        </div>
    );
}
