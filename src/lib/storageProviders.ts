/**
 * Storage Providers - AutoContent
 * Sistema modular para diferentes destinos de salvamento de conteúdo
 * 
 * Suporta:
 * - ZIP Local (padrão)
 * - Google Drive (requer configuração)
 */

import { toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// ============ TIPOS ============

export type StorageProviderId = 'zip-local' | 'google-drive';

export interface StorageProviderMeta {
    id: StorageProviderId;
    name: string;
    icon: string;
    description: string;
}

export interface SaveOptions {
    slides: any[];
    contentTitle: string;
    caption?: string;
    format: 'carousel' | 'story';
    slideIdPrefix?: string;
}

export interface StorageProvider extends StorageProviderMeta {
    /** Verifica se o provider está disponível/configurado */
    isAvailable: () => boolean;
    /** Salva o conteúdo usando este provider */
    save: (options: SaveOptions) => Promise<SaveResult>;
}

export interface SaveResult {
    success: boolean;
    message: string;
    url?: string;        // URL do arquivo/pasta (para Drive)
    folderId?: string;   // ID da pasta criada (para Drive)
}

// ============ CONFIGURAÇÕES DE IMAGEM ============

const INSTAGRAM_IMAGE_CONFIG = {
    quality: 0.95,
    cacheBust: true,
};

// ============ FUNÇÕES UTILITÁRIAS ============

/**
 * Captura slides do DOM e retorna array de base64
 */
async function captureSlides(
    slideCount: number,
    slideIdPrefix: string = 'export-slide'
): Promise<{ name: string; data: string }[]> {
    const files: { name: string; data: string }[] = [];

    // Warmup
    const firstNode = document.getElementById(`${slideIdPrefix}-0`);
    if (firstNode) {
        try {
            await toJpeg(firstNode, INSTAGRAM_IMAGE_CONFIG);
        } catch (e) {
            console.log('Warmup capture failed (normal):', e);
        }
    }

    // Capturar cada slide
    for (let i = 0; i < slideCount; i++) {
        const node = document.getElementById(`${slideIdPrefix}-${i}`);
        if (node) {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                const dataUrl = await toJpeg(node, INSTAGRAM_IMAGE_CONFIG);
                const base64Data = dataUrl.split(',')[1];
                files.push({
                    name: `slide-${i + 1}.jpg`,
                    data: base64Data
                });
            } catch (err) {
                console.error(`Erro ao capturar slide ${i + 1}:`, err);
            }
        }
    }

    return files;
}

/**
 * Sanitiza nome para uso em arquivos/pastas
 */
function sanitizeName(name: string): string {
    return name
        .replace(/\s+/g, '-')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 50);
}

// ============ ZIP LOCAL PROVIDER ============

export const ZipLocalProvider: StorageProvider = {
    id: 'zip-local',
    name: 'Download Local',
    icon: '📥',
    description: 'Baixa um arquivo ZIP com todas as imagens para seu dispositivo.',

    isAvailable: () => true, // Sempre disponível

    save: async (options: SaveOptions): Promise<SaveResult> => {
        const { slides, contentTitle, caption, format, slideIdPrefix = 'export-slide' } = options;

        if (!slides || slides.length === 0) {
            return { success: false, message: 'Nenhum slide para exportar' };
        }

        try {
            const files = await captureSlides(slides.length, slideIdPrefix);

            if (files.length === 0) {
                return { success: false, message: 'Erro ao capturar slides' };
            }

            const zip = new JSZip();

            // Adicionar imagens ao ZIP
            for (const file of files) {
                zip.file(file.name, file.data, { base64: true });
            }

            // Adicionar legenda para carousel
            if (format === 'carousel' && caption) {
                zip.file('legenda.txt', caption);
            }

            // Gerar e salvar
            const sanitizedName = sanitizeName(contentTitle);
            const zipFileName = format === 'story'
                ? `stories-${sanitizedName}.zip`
                : `carrossel-${sanitizedName}.zip`;

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, zipFileName);

            return {
                success: true,
                message: `Download iniciado: ${zipFileName}`
            };
        } catch (err) {
            console.error('Erro no ZipLocalProvider:', err);
            return {
                success: false,
                message: 'Erro ao gerar ZIP. Tente novamente.'
            };
        }
    }
};

// ============ GOOGLE DRIVE PROVIDER ============

export const GoogleDriveProvider: StorageProvider = {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '☁️',
    description: 'Salva arquivo ZIP diretamente no Google Drive.',

    isAvailable: () => {
        // Verifica se as credenciais estão configuradas no servidor
        // No cliente, consideramos disponível e deixamos a API validar
        return true;
    },

    save: async (options: SaveOptions): Promise<SaveResult> => {
        const { slides, contentTitle, caption, format, slideIdPrefix = 'export-slide' } = options;

        if (!slides || slides.length === 0) {
            return { success: false, message: 'Nenhum slide para exportar' };
        }

        try {
            // Capturar slides
            const files = await captureSlides(slides.length, slideIdPrefix);

            if (files.length === 0) {
                return { success: false, message: 'Erro ao capturar slides' };
            }

            // Criar ZIP igual ao download local
            const zip = new JSZip();

            // Adicionar imagens ao ZIP
            for (const file of files) {
                zip.file(file.name, file.data, { base64: true });
            }

            // Adicionar legenda para carousel
            if (format === 'carousel' && caption) {
                zip.file('legenda.txt', caption);
            }

            // Gerar ZIP como base64
            const zipBase64 = await zip.generateAsync({ type: 'base64' });

            // Nome do arquivo
            const sanitizedName = sanitizeName(contentTitle);
            const zipFileName = format === 'story'
                ? `stories-${sanitizedName}.zip`
                : `carrossel-${sanitizedName}.zip`;

            // Chamar API do servidor para upload do ZIP
            const response = await fetch('/api/storage/drive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: zipFileName,
                    fileData: zipBase64,
                    mimeType: 'application/zip'
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao salvar no Drive');
            }

            return {
                success: true,
                message: `Salvo no Google Drive: ${zipFileName}`,
                folderId: result.fileId,
                url: result.url
            };
        } catch (err) {
            console.error('Erro no GoogleDriveProvider:', err);
            return {
                success: false,
                message: err instanceof Error ? err.message : 'Erro ao salvar no Drive'
            };
        }
    }
};

// ============ REGISTRY ============

export const STORAGE_PROVIDERS: StorageProvider[] = [
    ZipLocalProvider,
    GoogleDriveProvider,
];

/**
 * Obtém um provider pelo ID
 */
export function getStorageProvider(id: StorageProviderId): StorageProvider {
    const provider = STORAGE_PROVIDERS.find(p => p.id === id);
    return provider || ZipLocalProvider; // Fallback para ZIP
}

/**
 * Obtém apenas os metadados dos providers (para UI)
 */
export function getStorageProvidersMeta(): StorageProviderMeta[] {
    return STORAGE_PROVIDERS.map(({ id, name, icon, description }) => ({
        id, name, icon, description
    }));
}
