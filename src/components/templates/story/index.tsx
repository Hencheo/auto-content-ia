/**
 * Roteador de Templates de Story
 * 
 * Se o tema tem templateComponent definido, usa o template modular.
 * Caso contrário, retorna null para usar fallback.
 */

import React from 'react';
import { Theme } from '@/types/theme';

// Templates Modulares
import { BreakingNewsTemplate } from './BreakingNewsTemplate';
import { ModernStoryTemplate } from './ModernStoryTemplate';

export interface StoryTemplateProps {
    data: {
        type: string;
        title: string;
        subtitle?: string;
        body?: string;
    };
    index: number;
    total: number;
    id?: string;
    profile: {
        name: string;
        handle: string;
        image: string | null;
    };
    theme: Theme;
    scale?: number;
}

// Registro de templates modulares
const templateRegistry: Record<string, React.ComponentType<StoryTemplateProps>> = {
    'BreakingNewsTemplate': BreakingNewsTemplate,
    'ModernStoryTemplate': ModernStoryTemplate,
};

/**
 * Retorna o componente de template modular se existir.
 * Retorna null se o tema deve usar fallback.
 */
export function getStoryTemplate(theme: Theme): React.ComponentType<StoryTemplateProps> | null {
    if (!theme.templateComponent) {
        return null;
    }

    return templateRegistry[theme.templateComponent] || null;
}

/**
 * Verifica se um tema de story usa template modular
 */
export function hasStoryModularTemplate(theme: Theme): boolean {
    return !!theme.templateComponent && !!templateRegistry[theme.templateComponent];
}
