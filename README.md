# Gerador de Carrosséis 360º (AutoContent)

Aplicação web para geração automática de carrosséis para Instagram focada no nicho de Consultoria Financeira.

## Stack
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: CSS Modules / Vanilla CSS (Design System Premium)
- **IA**: Google Gemini API (`gemini-1.5-flash-001`)
- **Exportação**: HTML-to-Image + JSZip

## Configuração

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env.local` na raiz com sua chave da API Gemini:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=Sua_Chave_Aqui
   ```
4. Rode o projeto:
   ```bash
   npm run dev
   ```

## Uso
Acesse `http://localhost:3000`, digite um tema (ex: "Planejamento Financeiro para Médicos") e gere seu carrossel.
