import React from 'react';
import { BreakingNewsTemplate, ModernStoryTemplate } from './templates/StoryTemplates';

export type StoryTemplateId = 'breaking-news' | 'modern-story';

interface StorySlideProps {
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
    templateId?: StoryTemplateId;
}

export function StorySlide(props: StorySlideProps) {
    const { templateId = 'breaking-news', scale = 1, id } = props;

    return (
        <div
            id={id}
            style={{
                width: '1080px',
                height: '1920px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                overflow: 'hidden',
                // Se scale for 1, ocupa o espaço normal. Se for menor, o container pai deve ajustar o tamanho.
                // Mas aqui apenas renderizamos o conteúdo.
            }}
        >
            {templateId === 'breaking-news' && <BreakingNewsTemplate {...props} />}
            {templateId === 'modern-story' && <ModernStoryTemplate {...props} />}
        </div>
    );
}
