/**
 * useSlideNavigation - Custom hook para navegação de slides
 * Extrai lógica comum de navegação prev/next encontrada em múltiplos componentes
 */

import { useState, useCallback } from 'react';

interface UseSlideNavigationOptions {
    /** Índice inicial (default: 0) */
    initialIndex?: number;
    /** Se deve fazer loop (default: false) */
    loop?: boolean;
}

interface UseSlideNavigationReturn {
    /** Índice atual do slide */
    currentIndex: number;
    /** Avançar para o próximo slide */
    next: () => void;
    /** Voltar para o slide anterior */
    prev: () => void;
    /** Ir para um slide específico */
    goTo: (index: number) => void;
    /** Se está no primeiro slide */
    isFirst: boolean;
    /** Se está no último slide */
    isLast: boolean;
    /** Resetar para o índice inicial */
    reset: () => void;
}

export function useSlideNavigation(
    totalSlides: number,
    options: UseSlideNavigationOptions = {}
): UseSlideNavigationReturn {
    const { initialIndex = 0, loop = false } = options;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const next = useCallback(() => {
        setCurrentIndex((current) => {
            if (current >= totalSlides - 1) {
                return loop ? 0 : current;
            }
            return current + 1;
        });
    }, [totalSlides, loop]);

    const prev = useCallback(() => {
        setCurrentIndex((current) => {
            if (current <= 0) {
                return loop ? totalSlides - 1 : current;
            }
            return current - 1;
        });
    }, [totalSlides, loop]);

    const goTo = useCallback((index: number) => {
        const safeIndex = Math.max(0, Math.min(index, totalSlides - 1));
        setCurrentIndex(safeIndex);
    }, [totalSlides]);

    const reset = useCallback(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    return {
        currentIndex,
        next,
        prev,
        goTo,
        isFirst: currentIndex === 0,
        isLast: currentIndex === totalSlides - 1,
        reset,
    };
}
