# DM Lite

Escudo digital leve para Mestres de RPG, complementar ao PJ Lite.

## 0.5.4 Alpha — versão principal

Esta versão substitui a linha antiga no próprio projeto Vercel do DM Lite para preservar o mesmo origin do navegador e permitir a migração automática dos saves existentes.

### Migração

- Mantém o mesmo projeto/domínio de produção: https://dmliterpg.vercel.app/
- Migra `dmlite_shields_v1` e `dmlite_current_shield_v1` para o schema atual.
- Recupera também `dmlite_v030_layout` e `dmlite_v030_settings` das versões 0.3.x quando necessário.
- Converte IDs antigos para o formato atual sem quebrar a mesa selecionada.
- Preserva páginas de Nota, iniciativa, tabelas, NPCs, relógios, links, imagens e fichas importadas.
- Converte tema, tamanho da interface, fundo e opacidade antigos.
- Mantém as chaves antigas no navegador como fallback; a migração não apaga o save legado.
- Continua aceitando códigos `DMLITE3:`, `DMLITE2:` e `DMLITE1:`.

### Destaques

- Home inspirada no dashboard do PJ Lite.
- Janelas flutuantes no desktop com arraste estabilizado.
- Mobile próprio: pilha vertical, foco de janela e reordenação.
- Escudos prontos de Dragonbane, Fabula Ultima, D&D 5.5e, Tormenta20, Ordem Paranormal, 3DeT Victory e 3D&T Alpha.
- Integração com o PJ Lite oficial por Código da Ficha, ZIP ou JSON.
- Mini fichas estilizadas por sistema e corrigidas para temas claros/escuros.
- Leitor grande de PDFs e PDF Mini com zoom nativo do visualizador para preservar nitidez.
- Backup/importação por JSON e código DM Lite.

## Filosofia

DM Lite não pretende ser um VTT. A proposta é manter apenas o que ajuda o Mestre durante a sessão: notas, iniciativa, dados, tabelas, NPCs, relógios, links, imagens, fichas resumidas e consulta de materiais.

## Ecossistema Lite

- PJ Lite: https://pjlite.vercel.app/
- DM Lite: https://dmliterpg.vercel.app/

## Desenvolvimento

```bash
npm install
npm run check
npm run dev
```

`npm run check` executa o teste de migração dos saves antigos e em seguida o build do Vite.

## Código aberto

Projeto gratuito e sem fins lucrativos. Os dados ficam localmente no navegador e podem ser exportados pelo usuário.
