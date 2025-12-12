import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { getVoiceTone, BASE_CONTENT_INSTRUCTION, VoiceToneId, DEFAULT_VOICE_TONE } from '@/lib/voiceTones';

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
        voiceTone?: VoiceToneId;
        sourceUrl?: string;  // URL da fonte para stories
    };
}

// ============ PROMPTS ============
function buildCarouselPrompt(profession?: string, product?: string, audience?: string, voiceTone?: VoiceToneId) {
    const role = profession || 'Especialista na sua área';
    const target = audience || 'seu público-alvo ideal';
    const offering = product || 'seus produtos ou serviços';

    // Obtém instrução de tom de voz
    const tone = getVoiceTone(voiceTone || DEFAULT_VOICE_TONE);
    const toneInstruction = tone?.promptInstruction || '';

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
Você é um ${role} com anos de experiência ajudando ${target}.
Seu objetivo é criar carrosséis de ALTA CONVERSÃO para Instagram usando o framework SPIN SELLING combinado com storytelling persuasivo.

========================================
TOM DE VOZ (OBRIGATÓRIO)
========================================
${toneInstruction}

${BASE_CONTENT_INSTRUCTION}

Contexto do criador:
- Profissão: ${role}
- Público-alvo: ${target}
- Oferta: ${offering}

========================================
FRAMEWORK SPIN + PAS PARA CARROSSÉIS
========================================

Use esta metodologia poderosa para criar conteúdo que VENDE:

**S (Situação)** → Mostre que você ENTENDE o contexto do público
**P (Problema)** → Identifique a DOR específica que enfrentam
**I (Implicação)** → Revele os RISCOS e CONSEQUÊNCIAS de não resolver
**N (Need-Payoff)** → Apresente a SOLUÇÃO e os benefícios

========================================
ESTRUTURA OBRIGATÓRIA DOS SLIDES
========================================

SLIDE 1 - COVER (Gancho):
- Promessa ousada OU pergunta provocativa
- Deve PARAR O SCROLL imediatamente
- Exemplo: "3 erros que estão destruindo seu [X]" ou "Por que 90% das pessoas falham em [X]"

SLIDE 2 - SITUAÇÃO (S):
- Mostre que você entende o dia-a-dia do público
- Valide a realidade deles com empatia
- Crie conexão: "Você é like eu ou alguém que você conhece?"

SLIDE 3 - PROBLEMA (P):
- Revele o problema REAL (não o superficial)
- Seja específico e técnico (gera autoridade)
- Tom: "A verdade que ninguém te conta..."

SLIDE 4 - IMPLICAÇÃO (I) - ⚠️ RISCOS:
- Este é o slide mais importante!
- Mostre as CONSEQUÊNCIAS de não resolver
- Use dados, estatísticas ou casos reais
- Crie URGÊNCIA: "Se você não resolver isso agora..."

SLIDE 5 - INSIGHT EXCLUSIVO:
- Compartilhe conhecimento que só EXPERTS têm
- Pode ser uma técnica, framework ou segredo do mercado
- Tom de autoridade: "Na minha experiência de X anos..."

SLIDE 6 - SOLUÇÃO (N - Need-Payoff):
- Apresente O CAMINHO para resolver
- Posicione o criador como quem tem a resposta
- Benefícios claros e tangíveis

SLIDE 7 - CTA:
- Chamada para ação específica
- Não seja genérico. Crie senso de oportunidade.
- Estilo recomendado: "${ctaStyle}"

========================================
ESTRUTURA JSON OBRIGATÓRIA
========================================

Retorne APENAS um JSON válido:
{
  "theme": "Título do Tema",
  "caption": "Legenda completa...",
  "slides": [
    { "type": "cover", "title": "Gancho Forte", "subtitle": "Subtítulo provocativo" },
    { "type": "content", "title": "Situação Atual", "body": "Contexto empático." },
    { "type": "content", "title": "O Problema Real", "body": "Dor específica." },
    { "type": "highlight", "title": "⚠️ Riscos de Ignorar", "body": "Consequências sérias." },
    { "type": "content", "title": "O Que Experts Sabem", "body": "Conhecimento exclusivo." },
    { "type": "highlight", "title": "A Solução", "body": "Como resolver." },
    { "type": "cta", "title": "Próximo Passo", "body": "Chamada para ação." }
  ]
}

========================================
REGRAS DE OURO
========================================

1. NUNCA use hashtags (#) dentro dos slides
2. Tom: Autoridade + Empatia (você é expert MAS entende a dor)
3. Cada slide deve fazer o leitor PRECISAR ver o próximo
4. Use números e dados quando possível (credibilidade)
5. O slide de IMPLICAÇÃO é crucial: gere desconforto construtivo
6. Linguagem adaptada para: ${target}
7. ⚠️ CONSISTÊNCIA OBRIGATÓRIA: Se o cover promete "X erros", "X dicas", "X passos", "X motivos", etc., você DEVE listar e explicar CADA UM desses X itens nos slides de conteúdo. Exemplo: Se o título é "3 erros que destroem seu negócio", os slides DEVEM apresentar Erro 1, Erro 2 e Erro 3 claramente. NUNCA faça uma promessa numérica no cover que não é cumprida nos slides.

========================================
REGRAS DA LEGENDA (CAPTION)
========================================

1. GANCHO (1-2 linhas): Pergunta ou afirmação que para o scroll

2. [linha vazia]

3. DESENVOLVIMENTO (3-5 parágrafos curtos):
   - Expanda com valor real
   - Use emojis estratégicos (máximo 5)
   - Parágrafos de 2-3 frases

4. [linha vazia]

5. CTA: "${ctaStyle}"

6. [linha vazia]

7. HASHTAGS: 5-8 hashtags relevantes (APENAS aqui, nunca nos slides)
`;
}

function buildStoryPrompt(context?: { profession: string, product: string, audience: string, voiceTone?: VoiceToneId, sourceUrl?: string }) {
    const target = context?.audience || 'o público geral';
    const role = context?.profession ? `Especialista em ${context.profession}` : 'Criador de Conteúdo';

    // Obtém instrução de tom de voz
    const tone = getVoiceTone(context?.voiceTone || DEFAULT_VOICE_TONE);
    const toneInstruction = tone?.promptInstruction || '';

    // Extrai domínio da URL se fornecido
    let sourceDomain = '';
    if (context?.sourceUrl) {
        try {
            const url = new URL(context.sourceUrl);
            sourceDomain = url.hostname.replace('www.', '');
        } catch {
            sourceDomain = '';
        }
    }

    return `
Você é um ${role} e MESTRE em Storytelling para redes sociais.
Seu objetivo é transformar notícias em uma NARRATIVA ENVOLVENTE de Instagram Stories para ${target}.

⚠️ ATENÇÃO: Você NÃO vai apenas resumir a notícia. Você vai CONTAR UMA HISTÓRIA que prende a atenção do início ao fim.

========================================
TOM DE VOZ (OBRIGATÓRIO)
========================================
${toneInstruction}

${BASE_CONTENT_INSTRUCTION}

========================================
🎯 FRAMEWORK: HOOK → LOOP → REVEAL
========================================

Este é o segredo para Stories que VIRALIZAM:

**📌 HOOK (Slide 1 - Cover)**
Seu único objetivo é PARAR O SCROLL. Use um destes padrões:
- ⚡ "Você não vai acreditar o que..." 
- 🔥 "Isso vai mudar a forma como você vê..."
- ❓ "Por que [X] está fazendo [Y]?"
- 😱 "A verdade sobre [X] que ninguém te conta"
- 🚨 "URGENTE: [algo impactante aconteceu]"
O gancho deve criar CURIOSIDADE irresistível!

**🔄 LOOP (Slides 2-5 - Desenvolvimento)**
Cada slide termina com um MICRO-SUSPENSE que obriga a pessoa a continuar:
- "Mas isso não é tudo..."
- "E o pior ainda está por vir..."
- "O que aconteceu depois chocou todo mundo..."
- "Só que tem um detalhe..."
- "E aqui que a história fica interessante..."

REGRA DE OURO: 1 insight por slide, máximo 2 frases.
Nunca entregue tudo de uma vez. Faça a pessoa PRECISAR do próximo slide.

**🎁 REVEAL (Slides 6-7 - Conclusão + CTA)**
- Entregue a revelação final ou conclusão da história
- Adicione sua OPINIÃO ou ANÁLISE como especialista
- Termine com pergunta que GERA RESPOSTA:
  → "O que você acha? Comente 🔥 ou ❄️"
  → "Você concorda? Me conta nos comentários"
  → "Isso te surpreendeu? Responde aqui 👇"

========================================
ESTRUTURA JSON OBRIGATÓRIA
========================================

Retorne APENAS um JSON válido com esta estrutura:
{
  "theme": "Manchete Principal (curta e impactante)",
  "sourceDomain": "${sourceDomain || 'domínio da fonte se disponível'}",
  "caption": "Legenda para o post...",
  "slides": [
    { "type": "cover", "title": "HOOK - Gancho que para o scroll", "subtitle": "Complemento que gera curiosidade" },
    { "type": "content", "title": "LOOP - Título curto", "body": "Desenvolvimento + micro-suspense no final" },
    { "type": "content", "title": "LOOP - Título curto", "body": "Mais contexto + gancho para próximo" },
    { "type": "highlight", "title": "LOOP - Ponto importante", "body": "Revelação parcial + suspense" },
    { "type": "content", "title": "LOOP - Desenvolvimento", "body": "Mais detalhes + transição para reveal" },
    { "type": "highlight", "title": "REVEAL - A grande revelação", "body": "Conclusão impactante da história" },
    { "type": "cta", "title": "REVEAL - Sua opinião", "body": "Pergunta que gera engajamento" }
  ]
}

========================================
REGRAS CRÍTICAS
========================================

1. NUNCA coloque hashtags (#) dentro dos slides
2. NUNCA resuma a notícia de forma seca - conte uma HISTÓRIA
3. Cada slide DEVE terminar criando expectativa para o próximo
4. Máximo 2 frases por slide - seja CONCISO
5. Use linguagem conversacional, como se contasse para um amigo
6. Gere entre 5 a 8 slides
7. O slide final (CTA) DEVE ter pergunta que gera resposta
8. O campo "sourceDomain" deve conter apenas o domínio da fonte original

========================================
REGRAS DA CAPTION
========================================

1. Hashtags vão APENAS na caption, nunca nos slides
2. Use 5-8 hashtags relevantes ao tema
3. A caption deve complementar a história, não repetí-la
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
                prompt = `${buildCarouselPrompt(context?.profession, context?.product, context?.audience, context?.voiceTone)}\n\nTEMA DO USUÁRIO: ${content}\n\nGere o conteúdo do carrossel em JSON.`;
                break;

            case 'carousel-article':
                prompt = `${buildCarouselPrompt(context?.profession, context?.product, context?.audience, context?.voiceTone)}\n\nCONTEÚDO DO ARTIGO:\n${content}\n\nTAREFA: Analise o artigo acima, extraia os principais insights estratégicos e crie um carrossel educativo seguindo as regras de conteúdo. Gere o JSON.`;
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
        const parsed = safeParseJSON(text) as Record<string, unknown>;

        // Para stories, garantir que o sourceDomain seja injetado diretamente
        // (não depender da IA retornar esse campo)
        if (type === 'story' && context?.sourceUrl) {
            try {
                const url = new URL(context.sourceUrl);
                parsed.sourceDomain = url.hostname.replace('www.', '');
            } catch {
                // Se não conseguir extrair, deixa vazio
            }
        }

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
