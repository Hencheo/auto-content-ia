import React, { useState } from 'react';

interface CaptionDisplayProps {
    caption: string;
}

export function CaptionDisplay({ caption }: CaptionDisplayProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{ padding: '0 1rem', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Legenda Sugerida</h3>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(caption);
                            alert('Legenda copiada!');
                        }}
                        className="btn"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.8rem',
                            padding: '0.4rem 0.8rem'
                        }}
                    >
                        Copiar
                    </button>
                </div>
                <div>
                    <p style={{
                        whiteSpace: 'pre-wrap',
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: expanded ? 'unset' : 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {caption}
                    </p>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: expanded ? 'var(--text-muted)' : 'var(--accent-gold)',
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: expanded ? 'normal' : 'bold',
                            padding: 0
                        }}
                    >
                        {expanded ? 'Ver menos' : 'Ver mais'}
                    </button>
                </div>
            </div>
        </div>
    );
}
