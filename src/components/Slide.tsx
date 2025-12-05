import React from 'react';
import { FinancialDark } from './templates/FinancialDark';
import { ModernClean } from './templates/ModernClean';

export type TemplateId = 'financial-dark' | 'modern-clean';

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
    templateId?: TemplateId;
}

export function Slide(props: SlideProps) {
    const { templateId = 'financial-dark' } = props;

    switch (templateId) {
        case 'financial-dark':
            return <FinancialDark {...props} />;
        case 'modern-clean':
            return <ModernClean {...props} />;
        default:
            return <FinancialDark {...props} />;
    }
}
