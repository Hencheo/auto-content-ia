import { Theme } from '@/types/theme';

export const themes: Theme[] = [
    // --- CAROUSEL THEMES ---
    {
        id: 'financial-dark',
        name: 'Financial Dark',
        type: 'carousel',
        styles: {
            background: '#1e293b', // slate-800
            text: '#ffffff',
            accent: '#fbbf24', // amber-400
            secondary: '#94a3b8', // slate-400
            muted: '#64748b', // slate-500
            border: '#334155', // slate-700
            fontFamily: 'Inter, sans-serif'
        },
        layout: {
            header: 'twitter',
            footer: 'bar',
            cover: 'centered',
            content: 'standard'
        }
    },
    {
        id: 'modern-clean',
        name: 'Modern Clean',
        type: 'carousel',
        styles: {
            background: '#ffffff',
            text: '#0f172a', // slate-900
            accent: '#3b82f6', // blue-500
            secondary: '#64748b', // slate-500
            muted: '#94a3b8', // slate-400
            border: '#e2e8f0', // slate-200
            fontFamily: 'Inter, sans-serif'
        },
        layout: {
            header: 'twitter',
            footer: 'bar',
            cover: 'centered',
            content: 'standard'
        }
    },

    // --- STORY THEMES ---
    {
        id: 'breaking-news',
        name: 'Breaking News',
        type: 'story',
        styles: {
            background: '#000000',
            text: '#ffffff',
            accent: '#ff0000', // red
            secondary: '#cccccc',
            muted: '#888888',
            border: '#333333',
            fontFamily: 'Inter, sans-serif'
        },
        layout: {
            header: 'none',
            footer: 'progress',
            cover: 'news-headline',
            content: 'news-body'
        }
    },
    {
        id: 'modern-story',
        name: 'Modern Story',
        type: 'story',
        styles: {
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            text: '#000000',
            accent: '#000000',
            secondary: '#555555',
            muted: 'rgba(0,0,0,0.2)',
            border: '#e2e8f0',
            fontFamily: 'Inter, sans-serif'
        },
        layout: {
            header: 'none',
            footer: 'progress',
            cover: 'minimal',
            content: 'card'
        }
    }
];

export function getTheme(id: string): Theme {
    return themes.find(t => t.id === id) || themes[0];
}
