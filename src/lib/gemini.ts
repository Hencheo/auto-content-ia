import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `
Você é um Estrategista Financeiro Sênior e Consultor de Negócios "360º".
Seu público são empresários que vivem no operacional, têm dinheiro mas não têm tempo, e misturam PF com PJ.
Seu objetivo é criar conteúdo para carrosséis do Instagram que toquem na ferida e ofereçam uma solução estratégica.

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
3. Foque em: Separação PF/PJ, Lucro Real, Investimentos, Construção de Patrimônio.
4. Evite clichês de "economizar cafezinho". Fale de grandes números.
5. O carrossel deve ter entre 5 a 7 slides.

REGRAS DA LEGENDA (CAPTION):
1. Use o método AIDA (Atenção, Interesse, Desejo, Ação).
2. Comece com uma pergunta ou afirmação polêmica.
3. Desenvolva o raciocínio em parágrafos curtos.
4. Finalize com uma CTA clara pedindo comentário ou direct.
5. Inclua 5-10 hashtags estratégicas no final (ex: #gestaofinanceira #empresario #lucro).
`;

export async function generateCarouselContent(topic: string, signal?: AbortSignal) {
  if (!API_KEY) {
    throw new Error("API Key não configurada.");
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nTEMA DO USUÁRIO: ${topic}\n\nGere o conteúdo do carrossel em JSON.`;

    const generationPromise = model.generateContent(prompt);

    if (signal) {
      const abortPromise = new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });

      const result = await Promise.race([generationPromise, abortPromise]) as any;
      const response = result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonString);
    }

    const result = await generationPromise;
    const response = result.response;
    const text = response.text();

    // Limpar markdown do JSON se houver
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
}

const STORY_SYSTEM_PROMPT = `
Você é um Estrategista de Conteúdo e Storyteller Especialista.
Seu objetivo é transformar notícias e artigos em uma sequência envolvente de Instagram Stories (formato 9:16).
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
2. Use "Ganchos" no primeiro slide para prender a atenção (ex: "Você não vai acreditar nisso...", "Isso muda tudo...").
3. Mantenha o texto CURTO. Stories são visuais e rápidos. Máximo de 2 frases por slide.
4. Use linguagem conversacional, como se estivesse contando para um amigo.
5. Gere entre 5 a 8 slides.
6. O último slide DEVE ter uma pergunta para gerar respostas (Enquete ou Caixinha de Perguntas).
`;

export async function generateStoryContent(articleContent: string, signal?: AbortSignal) {
  if (!API_KEY) {
    throw new Error("API Key não configurada.");
  }

  try {
    const prompt = `${STORY_SYSTEM_PROMPT}\n\nCONTEÚDO DA NOTÍCIA:\n${articleContent}\n\nGere a sequência de stories em JSON.`;

    const generationPromise = model.generateContent(prompt);

    if (signal) {
      const abortPromise = new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });

      const result = await Promise.race([generationPromise, abortPromise]) as any;
      const response = result.response;
      const text = response.text();
      const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonString);
    }

    const result = await generationPromise;
    const response = result.response;
    const text = response.text();

    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Erro ao gerar stories:", error);
    throw error;
  }
}
