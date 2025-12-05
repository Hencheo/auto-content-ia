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
`;

export async function generateCarouselContent(topic: string) {
  if (!API_KEY) {
    throw new Error("API Key não configurada.");
  }

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nTEMA DO USUÁRIO: ${topic}\n\nGere o conteúdo do carrossel em JSON.`;
    const result = await model.generateContent(prompt);
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
