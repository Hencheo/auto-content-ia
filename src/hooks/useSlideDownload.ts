/**
 * useSlideDownload - Custom hook para download de slides como ZIP
 * Extrai lógica de download encontrada em múltiplos componentes
 */

import { useState, useCallback, RefObject } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface DownloadOptions {
    /** Nome do arquivo ZIP (sem extensão) */
    filename?: string;
    /** Prefixo para os nomes dos arquivos de slide */
    slidePrefix?: string;
    /** Pixel ratio para qualidade da imagem */
    pixelRatio?: number;
}

interface UseSlideDownloadReturn {
    /** Se está fazendo download */
    downloading: boolean;
    /** Progresso do download (0-100) */
    progress: number;
    /** Erro do último download */
    error: string | null;
    /** Iniciar download de slides por ID */
    downloadSlidesById: (
        slideIds: string[],
        options?: DownloadOptions
    ) => Promise<void>;
    /** Iniciar download de slides por refs */
    downloadSlidesByRef: (
        refs: RefObject<HTMLDivElement | null>[],
        options?: DownloadOptions
    ) => Promise<void>;
}

export function useSlideDownload(): UseSlideDownloadReturn {
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const downloadSlidesById = useCallback(
        async (slideIds: string[], options: DownloadOptions = {}) => {
            const {
                filename = 'slides',
                slidePrefix = 'slide',
                pixelRatio = 1,
            } = options;

            setDownloading(true);
            setProgress(0);
            setError(null);

            try {
                const zip = new JSZip();
                const total = slideIds.length;

                // Warmup: primeira captura para "aquecer" o renderizador
                const firstNode = document.getElementById(slideIds[0]);
                if (firstNode) {
                    try {
                        await toPng(firstNode, { pixelRatio: 1 });
                    } catch (e) {
                        console.log('Warmup capture failed', e);
                    }
                }

                for (let i = 0; i < slideIds.length; i++) {
                    const node = document.getElementById(slideIds[i]);
                    if (node) {
                        try {
                            // Pequeno delay para garantir renderização em dispositivos móveis
                            await new Promise((resolve) => setTimeout(resolve, 50));

                            const dataUrl = await toPng(node, { pixelRatio });
                            const base64Data = dataUrl.split(',')[1];
                            zip.file(`${slidePrefix}-${i + 1}.png`, base64Data, { base64: true });
                        } catch (err) {
                            console.error(`Erro ao processar slide ${i}`, err);
                        }
                    }
                    setProgress(Math.round(((i + 1) / total) * 100));
                }

                const content = await zip.generateAsync({ type: 'blob' });
                saveAs(content, `${filename}.zip`);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erro desconhecido';
                setError(message);
                console.error('Erro ao gerar ZIP', err);
            } finally {
                setDownloading(false);
                setProgress(0);
            }
        },
        []
    );

    const downloadSlidesByRef = useCallback(
        async (
            refs: RefObject<HTMLDivElement | null>[],
            options: DownloadOptions = {}
        ) => {
            const {
                filename = 'slides',
                slidePrefix = 'slide',
                pixelRatio = 1,
            } = options;

            setDownloading(true);
            setProgress(0);
            setError(null);

            try {
                const zip = new JSZip();
                const total = refs.length;

                // Warmup
                const firstRef = refs[0]?.current;
                if (firstRef) {
                    try {
                        await toPng(firstRef, { pixelRatio: 1 });
                    } catch (e) {
                        console.log('Warmup capture failed', e);
                    }
                }

                for (let i = 0; i < refs.length; i++) {
                    const node = refs[i]?.current;
                    if (node) {
                        try {
                            await new Promise((resolve) => setTimeout(resolve, 50));

                            const dataUrl = await toPng(node, { pixelRatio });
                            const base64Data = dataUrl.split(',')[1];
                            zip.file(`${slidePrefix}-${i + 1}.png`, base64Data, { base64: true });
                        } catch (err) {
                            console.error(`Erro ao processar slide ${i}`, err);
                        }
                    }
                    setProgress(Math.round(((i + 1) / total) * 100));
                }

                const content = await zip.generateAsync({ type: 'blob' });
                saveAs(content, `${filename}.zip`);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erro desconhecido';
                setError(message);
                console.error('Erro ao gerar ZIP', err);
            } finally {
                setDownloading(false);
                setProgress(0);
            }
        },
        []
    );

    return {
        downloading,
        progress,
        error,
        downloadSlidesById,
        downloadSlidesByRef,
    };
}
