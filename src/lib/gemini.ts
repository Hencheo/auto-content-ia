import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// ============ CONFIGURAÇÃO DO PROVIDER ============
const AI_PROVIDER = process.env.NEXT_PUBLIC_AI_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";

// Gemini setup
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const geminiModel = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });

// Groq setup
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true }) : null;

/**
 * Função genérica para gerar conteúdo via AI
 * Suporta Gemini e Groq automaticamente
 */
async function generateWithAI(prompt: string, signal?: AbortSignal): Promise<string> {
  const provider = AI_PROVIDER;

  if (provider === 'groq' && groq) {
    console.log('🤖 Usando Groq API');
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-70b-versatile", // Modelo gratuito e poderoso
      temperature: 0.7,
      max_tokens: 4096,
    });
    return completion.choices[0]?.message?.content || '';
  }

  if (geminiModel) {
    console.log('🤖 Usando Gemini API');
    const generationPromise = geminiModel.generateContent(prompt);

    if (signal) {
      const abortPromise = new Promise<never>((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
      const result = await Promise.race([generationPromise, abortPromise]);
      return (result as any).response.text();
    }

    const result = await generationPromise;
    return result.response.text();
  }

  throw new Error("Nenhuma API Key configurada. Configure NEXT_PUBLIC_GEMINI_API_KEY ou NEXT_PUBLIC_GROQ_API_KEY");
}

/**
 * Limpa e faz parse seguro de JSON retornado pela API.
 */
function safeParseJSON(text: string): any {
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
  } catch (firstError) {
    console.warn('Parse direto falhou, tentando limpeza avançada...');
  }

  // 4. Limpeza avançada para casos problemáticos
  cleaned = cleaned
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/,\s*([\}\]])/g, '$1')
    .replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
      return `: "${p1}\\n${p2}"`;
    });

  // 5. Segunda tentativa após limpeza
  try {
    return JSON.parse(cleaned);
  } catch (secondError) {
    console.warn('Limpeza avançada falhou, tentando extração de campos...');
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
    console.error('Extração manual também falhou:', extractError);
  }

  throw new Error(`Erro ao processar JSON da API. Resposta: ${cleaned.substring(0, 200)}...`);
}

function buildSystemPrompt(profession?: string, product?: string, audience?: string) {
  const role = profession || 'Estrategista Financeiro Sênior e Consultor de Negócios "360º"';
  const target = audience || 'empresários que vivem no operacional, têm dinheiro mas não têm tempo, e misturam PF com PJ';
  const offering = product || 'soluções estratégicas de gestão e liberdade financeira';

  return `
Você é um ${role}.
Seu público alvo são ${target}.
Seu objetivo é criar conteúdo para carrosséis do Instagram que vendam ou eduquem sobre ${offering}.

ESTRUTURA DO CARROSSEL (JSON):
Deve retornar APENAS um JSON com a seguinte estrutura:
{
  "theme": "Título do Tema",
  "caption": "Legenda completa para o Instagram...",
  "slides": [
    { "type": "cover", "title": "Gancho Forte", "subtitle": "Subtítulo provocativo" },
    { "type": "content", "title": "Título do Slide", "body": "Texto curto e direto." },
    ...
    { "type": "cta", "title": "Chamada para Ação", "body": "Texto final" }
  ]
}

REGRAS DE CONTEÚDO:
1. Seja direto e autoritário, mas elegante.
2. Use gatilhos de urgência e exclusividade.
3. Adapte a linguagem para o público: ${target}.
4. Evite clichês. Fale de resultados reais.
5. O carrossel deve ter entre 5 a 7 slides.

REGRAS DA LEGENDA (CAPTION):
1. Use o método AIDA (Atenção, Interesse, Desejo, Ação).
2. Comece com uma pergunta ou afirmação polêmica.
3. Desenvolva o raciocínio em parágrafos curtos.
4. Finalize com uma CTA clara pedindo comentário ou direct.
5. Inclua 5-10 hashtags estratégicas no final.
`;
}

export async function generateCarouselContent(topic: string, signal?: AbortSignal, context?: { profession: string, product: string, audience: string }) {
  const systemPrompt = buildSystemPrompt(context?.profession, context?.product, context?.audience);
  const prompt = `${systemPrompt}\n\nTEMA DO USUÁRIO: ${topic}\n\nGere o conteúdo do carrossel em JSON.`;

  try {
    const text = await generateWithAI(prompt, signal);
    return safeParseJSON(text);
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
}

function buildStoryPrompt(context?: { profession: string, product: string, audience: string }) {
  const target = context?.audience || 'o público geral';
  const role = context?.profession ? `Especialista em ${context.profession}` : 'Estrategista de Conteúdo';

  return `
Você é um ${role} e Storyteller.
Seu objetivo é transformar notícias e artigos em uma sequência envolvente de Instagram Stories (formato 9:16) para ${target}.
O foco é RETENÇÃO e ENGAJAMENTO. Você deve pegar o fato principal e criar uma narrativa.

ESTRUTURA DOS STORIES (JSON):
Deve retornar APENAS um JSON com a seguinte estrutura:
{
  "theme": "Manchete Principal",
  "caption": "Sugestão de texto para postar junto (opcional)...",
  "slides": [
    { "type": "cover", "title": "Gancho Impactante", "subtitle": "Pergunta ou afirmação curiosa" },
    { "type": "content", "title": "Contexto", "body": "Explicação resumida do que aconteceu." },
    { "type": "highlight", "title": "Ponto Chave", "body": "O detalhe mais importante ou chocante." },
    ...
    { "type": "cta", "title": "Conclusão/Opinião", "body": "Pergunta para a audiência interagir." }
  ]
}

REGRAS DE STORYTELLING:
1. NÃO apenas resuma. Conte uma história.
2. Use "Ganchos" no primeiro slide para prender a atenção.
3. Mantenha o texto CURTO. Máximo de 2 frases por slide.
4. Use linguagem conversacional, como se estivesse contando para um amigo.
5. Gere entre 5 a 8 slides.
6. O último slide DEVE ter uma pergunta para gerar respostas.
`;
}

export async function generateStoryContent(articleContent: string, signal?: AbortSignal, context?: { profession: string, product: string, audience: string }) {
  const systemPrompt = buildStoryPrompt(context);
  const prompt = `${systemPrompt}\n\nCONTEÚDO DA NOTÍCIA:\n${articleContent}\n\nGere a sequência de stories em JSON.`;

  try {
    const text = await generateWithAI(prompt, signal);
    return safeParseJSON(text);
  } catch (error) {
    console.error("Erro ao gerar stories:", error);
    throw error;
  }
}

export async function generateCarouselFromArticle(articleContent: string, signal?: AbortSignal, context?: { profession: string, product: string, audience: string }) {
  const systemPrompt = buildSystemPrompt(context?.profession, context?.product, context?.audience);
  const prompt = `${systemPrompt}\n\nCONTEÚDO DO ARTIGO:\n${articleContent}\n\nTAREFA: Analise o artigo acima, extraia os principais insights estratégicos e crie um carrossel educativo seguindo as regras de conteúdo. Gere o JSON.`;

  try {
    const text = await generateWithAI(prompt, signal);
    return safeParseJSON(text);
  } catch (error) {
    console.error("Erro ao gerar carrossel via URL:", error);
    throw error;
  }
}
