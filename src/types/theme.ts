export interface ThemeStyles {
    background: string;
    text: string;
    accent: string;
    secondary: string;
    muted: string;
    border: string;
    fontFamily: string;
}

export interface ThemeLayout {
    header: 'twitter' | 'minimal' | 'centered' | 'news' | 'none' | 'badge' | 'chapter';
    footer: 'bar' | 'progress' | 'none' | 'simple' | 'dots' | 'line' | 'elegant-dots';
    cover: 'centered' | 'big-bold' | 'news-headline' | 'minimal' | 'dramatic' | 'glitch' | 'serif';
    content: 'standard' | 'card' | 'news-body' | 'minimal' | 'alternating' | 'card-glow' | 'alternating-align';
}

export interface Theme {
    id: string;
    name: string;
    type: 'carousel' | 'story';
    styles: ThemeStyles;
    layout: ThemeLayout;
    /** Nome do template modular (opcional). Se não definido, usa GenericSlide */
    templateComponent?: string;
}

