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
        <div style={{
            width: '1080px',
            height: '1920px',
            background: '#000000',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '80px',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Element */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)',
                zIndex: 0
            }} />

            {/* Header */}
            <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    {profile.image && (
                        <img
                            src={profile.image}
                            alt="Profile"
                            style={{ width: '140px', height: '140px', borderRadius: '50%', border: '6px solid #ff0000' }}
                        />
                    )}
                    <div>
                        <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{profile.name}</div>
                        <div style={{ fontSize: '36px', color: '#888' }}>{profile.handle}</div>
                    </div>
                </div>
                <div style={{
                    background: '#ff0000',
                    color: 'white',
                    padding: '10px 30px',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    textTransform: 'uppercase'
                }}>
                    News
                </div>
            </div>

            {/* Content */}
            <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {data.type === 'cover' && (
                    <>
                        <div style={{
                            background: '#ff0000',
                            color: 'white',
                            display: 'inline-block',
                            padding: '10px 20px',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            marginBottom: '40px',
                            alignSelf: 'flex-start'
                        }}>
                            URGENTE
                        </div>
                        <h1 style={{ fontSize: '110px', fontWeight: '900', lineHeight: '1.1', marginBottom: '40px' }}>
                            {data.title}
                        </h1>
                        <h2 style={{ fontSize: '48px', color: '#cccccc', fontWeight: 'normal' }}>
                            {data.subtitle}
                        </h2>
                    </>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <>
                        <h2 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '60px', color: '#ff0000' }}>
                            {data.title}
                        </h2>
                        <p style={{ fontSize: '56px', lineHeight: '1.4', color: '#ffffff' }}>
                            {data.body}
                        </p>
                    </>
                )}

                {data.type === 'cta' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '80px', fontWeight: 'bold', marginBottom: '60px' }}>
                            {data.title}
                        </h2>
                        <div style={{
                            border: '4px solid #ff0000',
                            padding: '60px',
                            borderRadius: '40px',
                            background: 'rgba(255, 0, 0, 0.1)'
                        }}>
                            <p style={{ fontSize: '56px', fontWeight: 'bold' }}>
                                {data.body}
                            </p>
                            <div style={{ marginTop: '40px', fontSize: '32px', color: '#888' }}>
                                👇 Responda abaixo
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Progress */}
            <div style={{ zIndex: 1, display: 'flex', gap: '10px', marginTop: '40px' }}>
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '8px',
                            background: i <= index ? '#ff0000' : '#333333',
                            borderRadius: '4px'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export function ModernStoryTemplate({ data, index, total, profile }: StoryTemplateProps) {
    return (
        <div style={{
            width: '1080px',
            height: '1920px',
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '80px',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                zIndex: 0
            }} />

            {/* Header */}
            <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '30px' }}>
                {profile.image && (
                    <img
                        src={profile.image}
                        alt="Profile"
                        style={{ width: '140px', height: '140px', borderRadius: '50%', border: '4px solid #000' }}
                    />
                )}
                <div>
                    <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{profile.name}</div>
                    <div style={{ fontSize: '36px', color: '#555' }}>{profile.handle}</div>
                </div>
            </div>

            {/* Content */}
            <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {data.type === 'cover' && (
                    <>
                        <h1 style={{ fontSize: '100px', fontWeight: '800', lineHeight: '1.1', marginBottom: '60px', letterSpacing: '-2px' }}>
                            {data.title}
                        </h1>
                        <div style={{ width: '100px', height: '10px', background: '#000', marginBottom: '60px' }} />
                        <h2 style={{ fontSize: '48px', color: '#444', fontWeight: 'normal', lineHeight: '1.4' }}>
                            {data.subtitle}
                        </h2>
                    </>
                )}

                {(data.type === 'content' || data.type === 'highlight') && (
                    <div style={{ background: 'white', padding: '60px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '40px', color: '#000' }}>
                            {data.title}
                        </h2>
                        <p style={{ fontSize: '52px', lineHeight: '1.5', color: '#333' }}>
                            {data.body}
                        </p>
                    </div>
                )}

                {data.type === 'cta' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '60px' }}>
                            {data.title}
                        </h2>
                        <div style={{
                            background: '#000',
                            color: 'white',
                            padding: '60px',
                            borderRadius: '40px',
                        }}>
                            <p style={{ fontSize: '52px', fontWeight: 'bold' }}>
                                {data.body}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Progress */}
            <div style={{ zIndex: 1, display: 'flex', gap: '10px', marginTop: '40px' }}>
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '6px',
                            background: i <= index ? '#000000' : 'rgba(0,0,0,0.2)',
                            borderRadius: '3px'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
