import React from 'react';
import { clsx } from 'clsx';

interface SlideProps {
    data: {
        type: string;
        title: string;
        subtitle?: string;
        body?: string;
    };
    index: number;
    total: number;
    id: string; // ID para exportação
}

export function Slide({ data, index, total, id }: SlideProps) {
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
                border: '1px solid var(--border-color)', // Para visualização na tela, pode ser removido na exportação se desejar
                marginBottom: '2rem',
                transform: 'scale(0.4)', // Scale down for preview
                transformOrigin: 'top left',
            }}
        >
            {/* Header / Brand */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
                <span style={{ fontSize: '24px', fontWeight: 600 }}>@SEU_INSTAGRAM</span>
                <span style={{ fontSize: '24px' }}>{index + 1}/{total}</span>
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
