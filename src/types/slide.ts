/**
 * Tipos para Slides - AutoContent
 * Define a estrutura de cada slide em carrosséis e stories
 */

/** Tipos conhecidos de slide com fallback para string */
export type SlideType = 'cover' | 'content' | 'cta' | 'highlight' | 'quote' | 'list' | (string & {});

export interface Slide {
    /** Tipo do slide que determina o layout */
    type: SlideType;
    /** Título principal do slide */
    title: string;
    /** Subtítulo opcional */
    subtitle?: string;
    /** Corpo do texto */
    body?: string;
    /** URL da imagem (base64 ou URL externa) */
    image?: string;
    /** Lista de itens para slides do tipo 'list' */
    items?: string[];
    /** Índice do slide no carrossel */
    index?: number;
}

export interface SlideProps {
    slide: Slide;
    theme: string;
    isActive?: boolean;
    onClick?: () => void;
}
