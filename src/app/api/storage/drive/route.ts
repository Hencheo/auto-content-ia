import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para upload de arquivo ZIP no Google Drive
 * 
 * Usa Service Account para autenticação server-side
 * Credenciais devem estar configuradas em .env.local
 */

// ============ CONFIGURAÇÃO ============
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const SERVICE_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

// ============ TIPOS ============
interface UploadRequest {
    fileName: string;
    fileData: string; // base64
    mimeType: string;
}

// ============ HANDLER ============
export async function POST(req: NextRequest) {
    // Verificar configuração
    if (!FOLDER_ID || !SERVICE_EMAIL || !SERVICE_KEY) {
        return NextResponse.json(
            {
                error: 'Google Drive não configurado. Configure as variáveis de ambiente: GOOGLE_DRIVE_FOLDER_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_KEY',
                configured: false
            },
            { status: 503 }
        );
    }

    try {
        const body: UploadRequest = await req.json();
        const { fileName, fileData, mimeType } = body;

        if (!fileName || !fileData) {
            return NextResponse.json(
                { error: 'fileName e fileData são obrigatórios' },
                { status: 400 }
            );
        }

        // Importar googleapis dinamicamente (só quando necessário)
        const { google } = await import('googleapis');

        // Processar a chave privada
        let privateKey = SERVICE_KEY;
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }
        privateKey = privateKey.replace(/\\n/g, '\n');

        console.log('[Drive API] Autenticando com Service Account:', SERVICE_EMAIL);

        // Autenticar com Service Account
        const auth = new google.auth.JWT({
            email: SERVICE_EMAIL,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const drive = google.drive({ version: 'v3', auth });

        // Converter base64 para Buffer
        const buffer = Buffer.from(fileData, 'base64');

        // Criar readable stream
        const { Readable } = await import('stream');
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        console.log(`[Drive API] Uploading arquivo: ${fileName} (${buffer.length} bytes)`);

        // Upload direto do arquivo ZIP para a pasta
        const file = await drive.files.create({
            supportsAllDrives: true,
            requestBody: {
                name: fileName,
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: mimeType || 'application/zip',
                body: stream,
            },
        });

        const fileId = file.data.id;
        if (!fileId) {
            throw new Error('Falha ao fazer upload do arquivo');
        }

        console.log(`[Drive API] Upload concluído: ${fileId}`);

        // URL para abrir o arquivo
        const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

        return NextResponse.json({
            success: true,
            fileId,
            fileName,
            url: fileUrl
        });

    } catch (error) {
        console.error('[Drive API] Erro:', error);

        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        return NextResponse.json(
            { error: message, success: false },
            { status: 500 }
        );
    }
}

// ============ CHECK ENDPOINT ============
export async function GET() {
    const configured = !!(FOLDER_ID && SERVICE_EMAIL && SERVICE_KEY);

    return NextResponse.json({
        configured,
        folderId: configured ? FOLDER_ID : null,
        message: configured
            ? 'Google Drive configurado e pronto para uso'
            : 'Google Drive não configurado. Configure as variáveis de ambiente.'
    });
}
