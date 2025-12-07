/**
 * Download Utilities
 * Funções utilitárias para download de slides como ZIP
 */

import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface DownloadOptions {
    slides: any[];
    theme: string;
    caption?: string;
    format: 'carousel' | 'story';
    slideIdPrefix?: string;
}

/**
 * Gera e baixa um arquivo ZIP contendo todas as imagens dos slides.
 * Para formato 'carousel', inclui também um arquivo legenda.txt.
 */
export async function downloadSlidesAsZip(options: DownloadOptions): Promise<void> {
    const {
        slides,
        theme,
        caption,
        format,
        slideIdPrefix = 'export-slide'
    } = options;

    if (!slides || slides.length === 0) {
        throw new Error('Nenhum slide para exportar');
    }

    const zip = new JSZip();

    // Warmup - captura dummy para "aquecer" o renderizador (fix iOS/Safari)
    const firstNode = document.getElementById(`${slideIdPrefix}-0`);
    if (firstNode) {
        try {
            await toPng(firstNode, { pixelRatio: 1 });
        } catch (e) {
            console.log('Warmup capture failed (normal):', e);
        }
    }

    // Capturar cada slide como PNG
    for (let i = 0; i < slides.length; i++) {
        const node = document.getElementById(`${slideIdPrefix}-${i}`);
        if (node) {
            try {
                // Pequeno delay para garantir renderização completa
                await new Promise(resolve => setTimeout(resolve, 100));

                const dataUrl = await toPng(node, {
                    pixelRatio: 1,
                    cacheBust: true,
                });

                // Remover prefixo data:image/png;base64,
                const base64Data = dataUrl.split(',')[1];

                // Nome do arquivo baseado no formato
                const fileName = format === 'story'
                    ? `story-${i + 1}.png`
                    : `slide-${i + 1}.png`;

                zip.file(fileName, base64Data, { base64: true });

            } catch (err) {
                console.error(`Erro ao processar ${format} ${i + 1}:`, err);
            }
        } else {
            console.warn(`Elemento não encontrado: ${slideIdPrefix}-${i}`);
        }
    }

    // Adicionar legenda.txt apenas para Carousel
    if (format === 'carousel' && caption) {
        zip.file('legenda.txt', caption);
    }

    // Gerar nome do arquivo ZIP
    const sanitizedTheme = theme
        .replace(/\s+/g, '-')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remove acentos

    const zipFileName = format === 'story'
        ? `stories-${sanitizedTheme}.zip`
        : `carrossel-${sanitizedTheme}.zip`;

    // Gerar e baixar o ZIP
    try {
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, zipFileName);
    } catch (err) {
        console.error('Erro ao gerar ZIP:', err);
        throw err;
    }
}

/**
 * Verifica se todos os slides foram renderizados para exportação
 */
export function checkSlidesReady(slideCount: number, slideIdPrefix: string = 'export-slide'): boolean {
    for (let i = 0; i < slideCount; i++) {
        const node = document.getElementById(`${slideIdPrefix}-${i}`);
        if (!node) return false;
    }
    return true;
}
