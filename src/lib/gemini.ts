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
