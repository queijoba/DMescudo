# Forja de Masmorras — Pixel Art 0.4

Gerador de masmorras pixel art para D&D 5e/5.5e, Tormenta20 e Dragonbane, com editor visual, andares conectados e impressão em folhas A4.

## Abrir o aplicativo
- Site: https://forja-de-masmorras.vercel.app
- Também funciona offline: abra `index.html` em um navegador.

## Novidade: impressão em mosaico A4
Na aba **Exportar**, escolha **Ajustar grid à quantidade de folhas** para configurar:
- 1 folha;
- 2 A4 lado a lado (2×1) ou empilhados (1×2);
- 4 folhas (2×2);
- 6 (3×2 ou 2×3), 9 (3×3), 12 (4×3);
- mosaico personalizado de 1 a 8 folhas em cada direção.

A medida em milímetros de cada quadrado é calculada automaticamente para caber no mosaico escolhido sem dividir nenhum quadrado entre duas folhas. Ative **Mostrar cortes das folhas sobre o mapa** para visualizar as divisões e sua ordem (A1, B1, A2 etc.). Há uma pequena prévia de montagem no painel de exportação.

### Tamanho fixo para miniaturas
Escolha **Quadrado fixo (miniaturas / mesa)** e selecione 10, 12,5, 15, 20 ou 25 mm. Neste modo o número de folhas é determinado pelo mapa e pode ser maior que os presets: o quadrado nunca é reduzido para caber num número de folhas imposto.

### Escala no jogo
- D&D 5e/5.5e e Tormenta20: 1 quadrado = **1,5 m**.
- Dragonbane: 1 quadrado = **2 m**.

A seleção de sistema ajusta a escala automaticamente, com ajuste manual disponível. Essa distância no mundo é independente dos milímetros do quadrado impresso.

### Como imprimir
1. Vá a Exportar (ou Configurar A4 no topo).
2. Selecione o modo, as folhas e orientação retrato/paisagem.
3. Opcionalmente ative a prévia das divisões A1/B1.
4. Clique em **Imprimir / Salvar em PDF A4**.
5. No diálogo de impressão use papel **A4**, **100%**, **nenhuma margem** e **gráficos de fundo ligados**. Não selecione "ajustar à página".
6. Apare as margens até os limites do grid e monte as folhas na ordem A1, B1, A2, B2.

Configurações de impressão são guardadas no JSON do projeto, junto do mapa editável.

## Outros recursos
- Gerador procedural por semente: salas, corredores, cavernas e labirintos.
- Andares acima/abaixo do nível térreo, escadas alinhadas.
- Estilo de pixel art original com paletas de cripta, ruínas, pedra e obsidiana.
- Salas retangulares por arrastar; edição de pisos, portas, paredes, água e armadilhas.
- Móveis e objetos pixelados, upload de imagens próprias, notas e ideias de mestre.
- Desfazer/refazer, importação/exportação JSON, exportação PNG.

## Referências
Consultados PDFs privados no Google Drive de D&D 5.5e (Livro do Mestre), Tormenta20 Jogo do Ano, Dragonbane Livro de Regras v1.1 e guias rápidos de Dragonbane. Nenhum PDF protegido ou recurso visual de jogo comercial é redistribuído pelo aplicativo; texturas e móveis são desenhos originais em Canvas.

Código mantido na branch `forja-masmorras-v02` do repositório `queijoba/DMescudo`. Deploy atual na Vercel é direto, sem sincronização automática por Git.
