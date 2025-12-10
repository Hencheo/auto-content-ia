/**
 * AI Generation Client
 * 
 * Este módulo é um wrapper cliente que chama a API route /api/ai/generate.
 * As API keys ficam seguras no servidor.
 */

interface GenerationContext {
  profession: string;
  product: string;
  audience: string;
}

interface GeneratedContent {
  theme: string;
  caption: string;
  slides: Array<{
    type: string;
    title: string;
    subtitle?: string;
    body?: string;
  }>;
}

/**
 * Gera conteúdo de carrossel a partir de um tema
 */
export async function generateCarouselContent(
  topic: string,
  signal?: AbortSignal,
  context?: GenerationContext
): Promise<GeneratedContent> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'carousel',
      content: topic,
      context
    }),
    signal
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao gerar carrossel');
  }

  return response.json();
}

/**
 * Gera conteúdo de carrossel a partir de um artigo/URL
 */
export async function generateCarouselFromArticle(
  articleContent: string,
  signal?: AbortSignal,
  context?: GenerationContext
): Promise<GeneratedContent> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'carousel-article',
      content: articleContent,
      context
    }),
    signal
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao gerar carrossel do artigo');
  }

  return response.json();
}

/**
 * Gera conteúdo de stories a partir de uma notícia/artigo
 */
export async function generateStoryContent(
  articleContent: string,
  signal?: AbortSignal,
  context?: GenerationContext
): Promise<GeneratedContent> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'story',
      content: articleContent,
      context
    }),
    signal
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao gerar stories');
  }

  return response.json();
}
