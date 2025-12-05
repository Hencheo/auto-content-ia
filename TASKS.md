# Planejamento do Projeto: Gerador de Carrossel

## 🚀 Próximos Passos (Templates)

- [x] **Refatoração Estrutural**: 
    - Criar pasta `src/components/templates`.
    - Mover o design atual (Financial Dark) de `Slide.tsx` para `src/components/templates/FinancialDark.tsx`.
- [x] **Dispatcher de Templates**: 
    - Atualizar `Slide.tsx` para aceitar uma prop `templateId`.
    - Implementar lógica para renderizar o componente de template correto dinamicamente.
- [x] **Novo Template (Modern Clean)**: 
    - Criar `src/components/templates/ModernClean.tsx`.
    - Implementar um visual mais claro, com tipografia diferente e layout geométrico distinto.
- [x] **UI de Seleção**: 
    - Adicionar estado `selectedTemplate` no `CarouselGenerator.tsx`.
    - Criar seletor visual de templates na interface antes do botão "Gerar".
- [x] **Validação**: 
    - Testar geração e download (ZIP) com ambos os templates.

## ✅ Concluído
- [x] Configuração inicial do projeto Next.js.
- [x] Integração com Gemini AI para geração de conteúdo.
- [x] Criação do componente base de Slide.
- [x] Funcionalidade de exportação para ZIP (html-to-image).
- [x] Geração via tecla "Enter".
