/**
 * Props Compartilhadas - AutoContent
 * Define props reutilizáveis entre componentes
 */

import { GeneratedContent } from './content';
import { Theme } from './theme';

/** Perfil do usuário para exibição em templates */
export interface UserProfile {
    name: string;
    handle: string;
    image: string | null;
}

/** Props base para componentes de exibição de resultado */
export interface ResultDisplayBaseProps {
    /** Conteúdo gerado pela IA */
    result: GeneratedContent;
    /** Formato do conteúdo */
    format: 'carousel' | 'story' | 'post';
    /** ID do tema selecionado */
    themeId: string;
    /** Callback para mudança de tema */
    onThemeChange: (themeId: string) => void;
    /** Callback para voltar */
    onBack: () => void;
    /** Callback para atualizar conteúdo */
    onUpdate: (newData: GeneratedContent) => void;
}

/** Props para o editor de conteúdo */
export interface ContentEditorBaseProps {
    /** Se o editor está aberto */
    isOpen: boolean;
    /** Callback para fechar */
    onClose: () => void;
    /** Dados do conteúdo */
    data: GeneratedContent;
    /** Callback para atualizar */
    onUpdate: (newData: GeneratedContent) => void;
    /** Tema atual */
    theme: Theme;
    /** Formato do conteúdo */
    format: 'carousel' | 'story';
    /** Perfil do usuário */
    profile: UserProfile;
}

/** Props para navegação de slides */
export interface SlideNavigationProps {
    currentIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrev: () => void;
    onGoTo?: (index: number) => void;
}

/** Props para ações de download */
export interface DownloadActionsProps {
    onDownload: () => void;
    onDownloadAll?: () => void;
    downloading: boolean;
}
