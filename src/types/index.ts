/**
 * Exportação centralizada de tipos - AutoContent
 */

// Re-export tipos de slides
export type { Slide, SlideType, SlideProps } from './slide';

// Re-export tipos de conteúdo
export type {
    GeneratedContent,
    CarouselContent,
    StoryContent,
    PostContent,
    ContentResult,
    ContentFormat
} from './content';

// Re-export props compartilhadas
export type {
    UserProfile,
    ResultDisplayBaseProps,
    ContentEditorBaseProps,
    SlideNavigationProps,
    DownloadActionsProps
} from './props';

// Re-export tipos de tema (existente)
export type { Theme, ThemeStyles, ThemeLayout } from './theme';
