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
            className="slide-container"
            style={{
                width: '1080px',
                height: '1350px',
                backgroundColor: '#ffffff', // White background
                color: '#1e293b', // Slate 800 text
                padding: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                marginBottom: '2rem',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                fontFamily: 'sans-serif', // Clean font
            }}
        >
            {/* Decorative Circle */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9', // Slate 100
                zIndex: 0
            }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1, marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#cbd5e1',
                    }}>
                        {profile.image ? (
                            <img
                                src={profile.image}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={40} color="#64748b" />
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>{profile.name}</p>
                            <BadgeCheck size={40} fill="#1d9bf0" color="white" />
                        </div>
                        <p style={{ fontSize: '32px', color: '#64748b', margin: 0, marginTop: '4px' }}>{profile.handle}</p>
                    </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#94a3b8' }}>
                    {index + 1} / {total}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
                {data.type === 'cover' && (
                    <div style={{ textAlign: 'left' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#0f172a',
                            color: 'white',
                            borderRadius: '50px',
                            fontSize: '24px',
                            marginBottom: '40px',
                            fontWeight: 600
                        }}>
                            NOVO POST
                        </div>
                        <h1 style={{
                            fontSize: '100px',
                            lineHeight: 1.1,
                            fontWeight: 900,
                            marginBottom: '40px',
                            color: '#0f172a',
                            letterSpacing: '-2px'
                        }}>
                            {data.title}
                        </h1>
                        <p style={{
                            fontSize: '48px',
                            color: '#475569',
                            fontWeight: 400,
                            lineHeight: 1.4
                        }}>
                            {data.subtitle}
                        </p>
                    </div>
                )}

                {data.type === 'content' && (
                    <div>
                        <h2 style={{
                            fontSize: '60px',
                            marginBottom: '60px',
                            color: '#0f172a',
                            fontWeight: 800
                        }}>
                            {data.title}
                        </h2>
                        <div style={{
                            fontSize: '40px',
                            lineHeight: 1.6,
                            color: '#334155',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {data.body}
                        </div>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div style={{ textAlign: 'center', backgroundColor: '#f8fafc', padding: '60px', borderRadius: '40px' }}>
                        <h2 style={{ fontSize: '64px', marginBottom: '40px', color: '#0f172a', fontWeight: 800 }}>
                            {data.title}
                        </h2>
                        <p style={{ fontSize: '40px', marginBottom: '60px', color: '#475569' }}>
                            {data.body}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <div style={{
                                padding: '20px 40px',
                                backgroundColor: '#0f172a',
                                color: 'white',
                                fontSize: '36px',
                                fontWeight: 'bold',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                Salvar Post <ArrowRight size={36} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Decorative Line */}
            <div style={{
                height: '10px',
                width: '100%',
                backgroundColor: '#0f172a',
                marginTop: 'auto',
                borderRadius: '10px'
            }} />
        </div>
    );
}
