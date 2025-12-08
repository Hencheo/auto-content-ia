import { Theme } from '@/types/theme';

export const themes: Theme[] = [
    // --- CAROUSEL THEMES ---
    {
        id: 'financial-dark',
        name: 'Financial Dark',
        type: 'carousel',
        templateComponent: 'FinancialDarkTemplate',
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
        templateComponent: 'ModernCleanTemplate',
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
    {
        id: 'neon-pulse',
        name: 'Neon Pulse',
        type: 'carousel',
        templateComponent: 'NeonPulseTemplate',
        styles: {
            background: 'linear-gradient(135deg, #1a0533 0%, #2d1b4e 50%, #4a1942 100%)',
            text: '#ffffff',
            accent: '#f472b6', // pink-400
            secondary: '#c084fc', // purple-400
            muted: '#a855f7', // purple-500
            border: '#7c3aed', // violet-600
            fontFamily: 'var(--font-poppins), Poppins, sans-serif'
        },
        layout: {
            header: 'twitter',
            footer: 'bar',
            cover: 'centered',
            content: 'standard'
        }
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        type: 'carousel',
        templateComponent: 'OceanBreezeTemplate',
        styles: {
            background: 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #14b8a6 100%)',
            text: '#ffffff',
            accent: '#22d3ee', // cyan-400
            secondary: '#67e8f9', // cyan-300
            muted: '#a5f3fc', // cyan-200
            border: '#06b6d4', // cyan-500
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
        id: 'sunset-vibes',
        name: 'Sunset Vibes',
        type: 'carousel',
        templateComponent: 'SunsetVibesTemplate',
        styles: {
            background: 'linear-gradient(135deg, #ff6b35 0%, #f72585 50%, #7209b7 100%)',
            text: '#ffffff',
            accent: '#ffbe0b', // amarelo vibrante
            secondary: '#fb8500', // laranja
            muted: '#ffb3c1', // rosa claro
            border: '#ff006e', // rosa forte
            fontFamily: 'Poppins, sans-serif'
        },
        layout: {
            header: 'twitter',
            footer: 'bar',
            cover: 'centered',
            content: 'standard'
        }
    },
    {
        id: 'luxury-gold',
        name: 'Luxury Gold',
        type: 'carousel',
        templateComponent: 'LuxuryGoldTemplate',
        styles: {
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            text: '#ffffff',
            accent: '#d4af37', // dourado clássico
            secondary: '#c9a227', // dourado escuro
            muted: '#b8860b', // dark goldenrod
            border: '#ffd700', // gold
            fontFamily: 'Playfair Display, serif'
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
