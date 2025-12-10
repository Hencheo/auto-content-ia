/**
 * Voice Tones - AutoContent
 * Módulo centralizado para definição de tons de voz da IA
 */

export type VoiceToneId = 'amigavel' | 'autoridade' | 'agressivo' | 'inspirador' | 'didatico';

export interface VoiceTone {
    id: VoiceToneId;
    label: string;
    emoji: string;
    description: string;
    promptInstruction: string;
}

/**
 * Definição dos tons de voz disponíveis
 * Para adicionar um novo tom, basta adicionar um objeto a este array
 */
export const VOICE_TONES: VoiceTone[] = [
    {
        id: 'amigavel',
        label: 'Amigável',
        emoji: '😊',
        description: 'Linguagem acolhedora e próxima',
        promptInstruction: `Use um tom amigável, acolhedor e próximo. Fale como um amigo que quer ajudar. Use emojis moderadamente para criar conexão. Seja caloroso mas profissional.`
    },
    {
        id: 'autoridade',
        label: 'Autoridade',
        emoji: '👔',
        description: 'Tom profissional e especialista',
        promptInstruction: `Use um tom de autoridade, como um especialista reconhecido no assunto. Seja confiante, assertivo e demonstre domínio do tema. Evite emojis excessivos, mantenha uma postura profissional.`
    },
    {
        id: 'agressivo',
        label: 'Agressivo',
        emoji: '🔥',
        description: 'Direto, urgente, foco em conversão',
        promptInstruction: `Use um tom agressivo e direto, focado em conversão. Crie urgência, use frases de impacto, seja provocativo. Desafie o leitor a agir AGORA. Use palavras fortes e chamadas à ação poderosas.`
    },
    {
        id: 'inspirador',
        label: 'Inspirador',
        emoji: '✨',
        description: 'Motivacional e encorajador',
        promptInstruction: `Use um tom inspirador e motivacional. Encoraje o leitor, mostre possibilidades, seja positivo. Faça o leitor acreditar que é possível alcançar seus objetivos. Use histórias de transformação.`
    },
    {
        id: 'didatico',
        label: 'Didático',
        emoji: '📚',
        description: 'Educativo e explicativo',
        promptInstruction: `Use um tom didático e educativo. Explique conceitos de forma clara, use exemplos práticos, divida informações em passos. Seja paciente e detalhado, como um professor dedicado.`
    }
];

export const DEFAULT_VOICE_TONE: VoiceToneId = 'amigavel';

/**
 * Obtém um tom de voz pelo ID
 */
export function getVoiceTone(id: VoiceToneId): VoiceTone | undefined {
    return VOICE_TONES.find(tone => tone.id === id);
}

/**
 * Instrução base que sempre é aplicada, independente do tom
 * Garante que o conteúdo tenha credibilidade
 */
export const BASE_CONTENT_INSTRUCTION = `
IMPORTANTE: Independente do tom de voz, você DEVE sempre:
- Trazer dados, estatísticas e fatos relevantes sobre o assunto
- Usar termos técnicos apropriados do nicho para passar credibilidade
- Incluir conhecimentos específicos e atualizados sobre o tema
- Demonstrar expertise profunda no assunto abordado
- Citar tendências ou práticas reconhecidas no mercado quando relevante
`;
