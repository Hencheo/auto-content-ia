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
    header: 'twitter' | 'minimal' | 'centered' | 'news';
    footer: 'bar' | 'progress' | 'none' | 'simple';
    cover: 'centered' | 'big-bold' | 'news-headline' | 'minimal';
    content: 'standard' | 'card' | 'news-body' | 'minimal';
}

export interface Theme {
    id: string;
    name: string;
    type: 'carousel' | 'story';
    styles: ThemeStyles;
    layout: ThemeLayout;
}
