/**
 * Tipos para Conteúdo Gerado - AutoContent
 * Define a estrutura do conteúdo retornado pela IA
 */

import { Slide } from './slide';

/** Formato de conteúdo suportado */
export type ContentFormat = 'carousel' | 'story' | 'post';

/** Conteúdo gerado base */
export interface GeneratedContent {
    /** Tema/template selecionado */
    theme: string;
    /** Legenda para o post */
    caption: string;
    /** Array de slides */
    slides: Slide[];
}

/** Conteúdo específico para carrossel */
export interface CarouselContent extends GeneratedContent {
    format: 'carousel';
}

/** Conteúdo específico para story */
export interface StoryContent extends GeneratedContent {
    format: 'story';
}

/** Conteúdo específico para post único */
export interface PostContent extends GeneratedContent {
    format: 'post';
}

/** União de todos os tipos de conteúdo */
export type ContentResult = CarouselContent | StoryContent | PostContent;
