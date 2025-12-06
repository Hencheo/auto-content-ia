import React, { useState } from 'react';

interface CaptionDisplayProps {
    caption: string;
}

export function CaptionDisplay({ caption }: CaptionDisplayProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="caption-container">
            <div className="card">
                <div className="caption-header">
                    <h3 className="caption-title">Legenda Sugerida</h3>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(caption);
                            alert('Legenda copiada!');
                        }}
                        className="btn caption-copy-btn"
                    >
                        Copiar
                    </button>
                </div>
                <div>
                    <p className={`caption-text ${expanded ? 'expanded' : ''}`}>
                        {caption}
                    </p>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`caption-toggle-btn ${expanded ? 'caption-toggle-text-muted' : 'caption-toggle-text-accent'}`}
                    >
                        {expanded ? 'Ver menos' : 'Ver mais'}
                    </button>
                </div>
            </div>
        </div>
    );
}
