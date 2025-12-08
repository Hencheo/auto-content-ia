/**
 * Roteador de Templates de Carrossel
 * 
 * Se o tema tem templateComponent definido, usa o template modular.
 * Caso contrário, retorna null para usar GenericSlide como fallback.
 */

import React from 'react';
import { Theme } from '@/types/theme';

// Templates Modulares
import { NeonPulseTemplate } from './NeonPulseTemplate';
import { LuxuryGoldTemplate } from './LuxuryGoldTemplate';
import { SunsetVibesTemplate } from './SunsetVibesTemplate';
import { OceanBreezeTemplate } from './OceanBreezeTemplate';
import { FinancialDarkTemplate } from './FinancialDarkTemplate';
import { ModernCleanTemplate } from './ModernCleanTemplate';
import { TweetStyleTemplate } from './TweetStyleTemplate';

export interface CarouselTemplateProps {
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

// Registro de templates modulares
const templateRegistry: Record<string, React.ComponentType<CarouselTemplateProps>> = {
    'NeonPulseTemplate': NeonPulseTemplate,
    'LuxuryGoldTemplate': LuxuryGoldTemplate,
    'SunsetVibesTemplate': SunsetVibesTemplate,
    'OceanBreezeTemplate': OceanBreezeTemplate,
    'FinancialDarkTemplate': FinancialDarkTemplate,
    'ModernCleanTemplate': ModernCleanTemplate,
    'TweetStyleTemplate': TweetStyleTemplate,
};

/**
 * Retorna o componente de template modular se existir.
 * Retorna null se o tema deve usar GenericSlide.
 */
export function getCarouselTemplate(theme: Theme): React.ComponentType<CarouselTemplateProps> | null {
    if (!theme.templateComponent) {
        return null; // Usar GenericSlide
    }

    return templateRegistry[theme.templateComponent] || null;
}

/**
 * Verifica se um tema usa template modular
 */
export function hasModularTemplate(theme: Theme): boolean {
    return !!theme.templateComponent && !!templateRegistry[theme.templateComponent];
}
