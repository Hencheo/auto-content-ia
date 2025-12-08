import React from 'react';
import { Theme } from '@/types/theme';
import { getStoryTemplate } from './templates/story';
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
    theme?: Theme;
}

export function StorySlide(props: StorySlideProps) {
    const { templateId = 'breaking-news', scale = 1, id, theme } = props;

    // Se theme foi fornecido, tentar usar template modular
    if (theme) {
        const ModularTemplate = getStoryTemplate(theme);
        if (ModularTemplate) {
            return (
                <div
                    id={id}
                    style={{
                        width: '1080px',
                        height: '1920px',
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        overflow: 'hidden',
                    }}
                >
                    <ModularTemplate
                        data={props.data}
                        index={props.index}
                        total={props.total}
                        id={id}
                        profile={props.profile}
                        theme={theme}
                        scale={1}
                    />
                </div>
            );
        }
    }

    // Fallback para templates antigos via templateId
    return (
        <div
            id={id}
            style={{
                width: '1080px',
                height: '1920px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                overflow: 'hidden',
            }}
        >
            {templateId === 'breaking-news' && <BreakingNewsTemplate {...props} />}
            {templateId === 'modern-story' && <ModernStoryTemplate {...props} />}
        </div>
    );
}
