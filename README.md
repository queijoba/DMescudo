# DM Lite — 0.5.0 Alpha

Escudo digital leve para mestres de RPG, agora separado do PJ Lite e preparado para evoluir de forma independente.

## Foco desta versão

- interface mais fluida, com arraste via `transform + requestAnimationFrame` e gravação apenas ao soltar;
- widgets isolados/memoizados para reduzir re-renderizações;
- autosave ocioso/debounced em `localStorage`;
- mobile próprio do DM Lite: pilha vertical, foco de janela, reordenação e dock;
- visual escuro revisado, sem Tailwind CDN ou fontes externas obrigatórias;
- importação/exportação de escudos em JSON e código `DMLITE3:`;
- compatibilidade de importação com `DMLITE2:` e `DMLITE1:`.

## Integração com PJ Lite

O DM Lite não depende do `localStorage` do PJ Lite. Ele importa a ficha pelo formato público usado pelo PJ Lite atual:

```js
LZString.compressToBase64(JSON.stringify(ficha))
```

Também aceita os arquivos ZIP/JSON exportados pelo PJ Lite.

Sistemas interpretados:

- Dragonbane
- D&D 5.5e
- Fabula Ultima
- O Som das Seis
- 3DeT Victory

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Saves

Chave local atual: `dmlite_shields_v2`.

O projeto é gratuito, sem fins lucrativos e mantém os dados no navegador do usuário.
