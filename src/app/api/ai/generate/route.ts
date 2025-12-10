import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// ============ CONFIGURAÇÃO DO PROVIDER (SERVER-SIDE ONLY) ============
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

// Gemini setup
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const geminiModel = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });

// Groq setup
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// ============ INTERFACES ============
interface GenerateRequest {
    type: 'carousel' | 'carousel-article' | 'story';
    content: string;
    context?: {
        profession: string;
        product: string;
        audience: string;
    };
}

// ============ PROMPTS ============
function buildCarouselPrompt(profession?: string, product?: string, audience?: string) {
    const role = profession || 'Especialista na sua área';
    const target = audience || 'seu público-alvo ideal';
    const offering = product || 'seus produtos ou serviços';

    // Determina tipo de CTA baseado na profissão
    let ctaStyle = 'Me chama no direct para conversarmos';
    if (profession) {
        const profLower = profession.toLowerCase();
        if (profLower.includes('consultor') || profLower.includes('coach') || profLower.includes('mentor')) {
            ctaStyle = 'Agende uma conversa estratégica no link da bio';
        } else if (profLower.includes('advogado') || profLower.includes('médico') || profLower.includes('contador')) {
            ctaStyle = 'Entre em contato para uma consulta personalizada';
        } else if (profLower.includes('vendedor') || profLower.includes('afiliado') || profLower.includes('digital')) {
            ctaStyle = 'Acesse o link na bio e saiba mais';
        } else if (profLower.includes('professor') || profLower.includes('educador') || profLower.includes('instrutor')) {
            ctaStyle = 'Comente "EU QUERO" para receber mais conteúdo';
        }
    }

    return `
Você é um ${role}.
Seu público alvo são ${target}.
Seu objetivo é criar conteúdo para carrosséis do Instagram que eduquem e engajem sobre ${offering}.

ESTRUTURA DO CARROSSEL (JSON):
Retorne APENAS um JSON válido com esta estrutura:
{
  "theme": "Título do Tema",
  "caption": "Legenda completa formatada conforme regras abaixo...",
  "slides": [
    { "type": "cover", "title": "Gancho Forte", "subtitle": "Subtítulo provocativo" },
    { "type": "content", "title": "Título do Slide", "body": "Texto curto e direto." },
    ...
    { "type": "cta", "title": "Chamada para Ação", "body": "Texto final" }
  ]
}

REGRAS DOS SLIDES (IMPORTANTE):
1. O carrossel deve ter entre 5 a 7 slides.
2. NUNCA coloque hashtags (#) dentro dos slides - nem no title, subtitle ou body.
3. Os slides devem ter texto limpo, profissional e visualmente agradável.
4. Cada slide deve criar curiosidade para o próximo (storytelling progressivo).
5. Estrutura recomendada:
   - Slide 1 (Cover): Promessa ou pergunta intrigante que prende atenção
   - Slides 2-4 (Content): Desenvolva a promessa com valor real e insights
   - Slide 5-6 (Highlight): Ponto de virada ou insight mais poderoso
   - Slide Final (CTA): Convite para ação de forma natural e profissional

REGRAS DE CONTEÚDO:
1. Seja direto e autoritário, mas elegante.
2. Use gatilhos de urgência e exclusividade quando apropriado.
3. Adapte a linguagem para o público: ${target}.
4. Evite clichês. Fale de resultados reais e transformações.
5. O último slide ANTES do CTA deve ter o insight mais valioso.

REGRAS DA LEGENDA (CAPTION) - ESTRUTURA OBRIGATÓRIA:
A legenda DEVE seguir esta formatação exata:

1. GANCHO (1-2 linhas): Pergunta provocativa ou afirmação impactante que para o scroll

2. [linha vazia]

3. DESENVOLVIMENTO (3-5 parágrafos curtos de 2-3 frases cada):
   - Expanda a ideia principal com valor real
   - Use parágrafos curtos separados por linha vazia
   - Pode usar emojis estratégicos (máximo 3-5 no total)

4. [linha vazia]

5. CTA (1-2 linhas): Chamada para ação personalizada
   - Estilo sugerido para este usuário: "${ctaStyle}"
   - NUNCA use CTAs genéricos como "me siga" ou "curta o post"
   - Crie senso de urgência ou exclusividade

6. [linha vazia]

7. HASHTAGS (5-8 hashtags): 
   - Relevantes ao nicho e ao tema
   - Separadas por espaço
   - APENAS aqui, nunca nos slides

Tom geral: Conversacional mas profissional. Adaptado para ${target}.
`;
}

function buildStoryPrompt(context?: { profession: string, product: string, audience: string }) {
    const target = context?.audience || 'o público geral';
    const role = context?.profession ? `Especialista em ${context.profession}` : 'Criador de Conteúdo';

    return `
Você é um ${role} e Storyteller profissional.
Seu objetivo é transformar notícias e artigos em uma sequência envolvente de Instagram Stories (formato 9:16) para ${target}.
O foco é RETENÇÃO e ENGAJAMENTO. Você deve pegar o fato principal e criar uma narrativa cativante.

ESTRUTURA DOS STORIES (JSON):
Retorne APENAS um JSON válido com esta estrutura:
{
  "theme": "Manchete Principal",
  "caption": "Sugestão de texto para postar junto...",
  "slides": [
    { "type": "cover", "title": "Gancho Impactante", "subtitle": "Pergunta ou afirmação curiosa" },
    { "type": "content", "title": "Contexto", "body": "Explicação resumida." },
    { "type": "highlight", "title": "Ponto Chave", "body": "O detalhe mais importante." },
    ...
    { "type": "cta", "title": "Conclusão/Opinião", "body": "Pergunta para a audiência." }
  ]
}

REGRAS DOS SLIDES (IMPORTANTE):
1. NUNCA coloque hashtags (#) dentro dos slides - nem no title, subtitle ou body.
2. Os slides devem ter texto limpo e impactante.
3. Cada slide deve criar suspense para o próximo.

REGRAS DE STORYTELLING:
1. NÃO apenas resuma. Conte uma história envolvente.
2. Use "Ganchos" no primeiro slide para prender a atenção.
3. Mantenha o texto CURTO. Máximo de 2 frases por slide.
4. Use linguagem conversacional, como se estivesse contando para um amigo.
5. Gere entre 5 a 8 slides.
6. O último slide DEVE ter uma pergunta para gerar respostas.
7. Crie tensão progressiva: cada slide mais interessante que o anterior.

REGRAS DA CAPTION (se aplicável):
1. Hashtags vão APENAS na caption, nunca nos slides.
2. Use 5-8 hashtags relevantes ao tema.
`;
}

// ============ AI GENERATION ============
async function generateWithAI(prompt: string): Promise<string> {
    const provider = AI_PROVIDER;

    if (provider === 'groq' && groq) {
        console.log('🤖 [API] Usando Groq API');
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 4096,
        });
        return completion.choices[0]?.message?.content || '';
    }

    if (geminiModel) {
        console.log('🤖 [API] Usando Gemini API');
        const result = await geminiModel.generateContent(prompt);
        return result.response.text();
    }

    throw new Error("Nenhuma API Key configurada. Configure GEMINI_API_KEY ou GROQ_API_KEY no servidor.");
}

// ============ JSON PARSING ============
function safeParseJSON(text: string): unknown {
    // 1. Remove markdown code blocks
    let cleaned = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

    // 2. Encontra o JSON válido (primeiro { até último })
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
        throw new Error('Não foi possível encontrar JSON válido na resposta');
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1);

    // 3. Tenta parse direto primeiro (caso mais comum)
    try {
        return JSON.parse(cleaned);
    } catch {
        console.warn('[API] Parse direto falhou, tentando limpeza avançada...');
    }

    // 4. Limpeza avançada para casos problemáticos
    cleaned = cleaned
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/,\s*([\}\]])/g, '$1')
        .replace(/:\s*"([^"]*)\n([^"]*)"/g, (_match, p1, p2) => {
            return `: "${p1}\\n${p2}"`;
        });

    // 5. Segunda tentativa após limpeza
    try {
        return JSON.parse(cleaned);
    } catch {
        console.warn('[API] Limpeza avançada falhou, tentando extração de campos...');
    }

    // 6. Última tentativa: extrair campos manualmente
    try {
        const themeMatch = cleaned.match(/"theme"\s*:\s*"([^"]+)"/);
        const captionMatch = cleaned.match(/"caption"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"slides"|"\s*\})/);
        const slidesMatch = cleaned.match(/"slides"\s*:\s*\[([\s\S]*)\]/);

        if (themeMatch && slidesMatch) {
            const slidesStr = `[${slidesMatch[1]}]`.replace(/,\s*([\}\]])/g, '$1');
            const slides = JSON.parse(slidesStr);

            return {
                theme: themeMatch[1],
                caption: captionMatch ? captionMatch[1].replace(/\\n/g, '\n') : '',
                slides: slides
            };
        }
    } catch (extractError) {
        console.error('[API] Extração manual também falhou:', extractError);
    }

    throw new Error(`Erro ao processar JSON da API. Resposta: ${cleaned.substring(0, 200)}...`);
}

// ============ API ROUTE HANDLER ============
export async function POST(req: NextRequest) {
    try {
        const body: GenerateRequest = await req.json();
        const { type, content, context } = body;

        if (!type || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: type and content' },
                { status: 400 }
            );
        }

        let prompt: string;

        switch (type) {
            case 'carousel':
                prompt = `${buildCarouselPrompt(context?.profession, context?.product, context?.audience)}\n\nTEMA DO USUÁRIO: ${content}\n\nGere o conteúdo do carrossel em JSON.`;
                break;

            case 'carousel-article':
                prompt = `${buildCarouselPrompt(context?.profession, context?.product, context?.audience)}\n\nCONTEÚDO DO ARTIGO:\n${content}\n\nTAREFA: Analise o artigo acima, extraia os principais insights estratégicos e crie um carrossel educativo seguindo as regras de conteúdo. Gere o JSON.`;
                break;

            case 'story':
                prompt = `${buildStoryPrompt(context)}\n\nCONTEÚDO DA NOTÍCIA:\n${content}\n\nGere a sequência de stories em JSON.`;
                break;

            default:
                return NextResponse.json(
                    { error: `Invalid type: ${type}. Use carousel, carousel-article, or story.` },
                    { status: 400 }
                );
        }

        const text = await generateWithAI(prompt);
        const parsed = safeParseJSON(text);

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('[API] Error generating content:', error);

        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
