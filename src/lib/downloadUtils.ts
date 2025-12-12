/**
 * Download Utilities
 * Funções utilitárias para download de slides como ZIP
 * 
 * ATUALIZADO: Imagens agora são exportadas em JPEG com qualidade 95% 
 * e fundo branco para compatibilidade ideal com Instagram
 */

import { toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface DownloadOptions {
    slides: any[];
    theme: string;              // Nome do template visual (ex: "financial-dark")
    contentTitle?: string;      // Título do conteúdo gerado pela IA (ex: "5 Erros de Investimento")
    caption?: string;
    format: 'carousel' | 'story';
    slideIdPrefix?: string;
}

/**
 * Configurações de imagem otimizadas para Instagram
 */
const INSTAGRAM_IMAGE_CONFIG = {
    quality: 0.95,              // 95% qualidade JPEG
    cacheBust: true,
};

/**
 * Gera e baixa um arquivo ZIP contendo todas as imagens dos slides.
 * Para formato 'carousel', inclui também um arquivo legenda.txt.
 * 
 * Imagens são exportadas em JPEG com qualidade 95% e fundo branco
 * seguindo as especificações ideais do Instagram.
 */
export async function downloadSlidesAsZip(options: DownloadOptions): Promise<void> {
    const {
        slides,
        theme,
        contentTitle,
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
            await toJpeg(firstNode, INSTAGRAM_IMAGE_CONFIG);
        } catch (e) {
            console.log('Warmup capture failed (normal):', e);
        }
    }

    // Capturar cada slide como JPEG (qualidade Instagram)
    for (let i = 0; i < slides.length; i++) {
        const node = document.getElementById(`${slideIdPrefix}-${i}`);
        if (node) {
            try {
                // Pequeno delay para garantir renderização completa
                await new Promise(resolve => setTimeout(resolve, 100));

                const dataUrl = await toJpeg(node, INSTAGRAM_IMAGE_CONFIG);

                // Remover prefixo data:image/jpeg;base64,
                const base64Data = dataUrl.split(',')[1];

                // Nome do arquivo baseado no formato (agora .jpg)
                const fileName = format === 'story'
                    ? `story-${i + 1}.jpg`
                    : `slide-${i + 1}.jpg`;

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

    // Usar o título do conteúdo para o nome do arquivo (não o nome do template)
    const displayName = contentTitle || theme;

    // Sanitizar nome do arquivo
    const sanitizedName = displayName
        .replace(/\s+/g, '-')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
        .replace(/[^a-z0-9-]/g, '')       // Remove caracteres especiais
        .substring(0, 50);                 // Limita tamanho

    const zipFileName = format === 'story'
        ? `stories-${sanitizedName}.zip`
        : `carrossel-${sanitizedName}.zip`;

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
