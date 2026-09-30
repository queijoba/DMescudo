# DM Lite

Escudo digital leve para Mestres de RPG. O projeto complementa o PJ Lite sem tentar substituir livros, fichas ou um VTT completo.

## Alpha 0.5.1

- Interface redesenhada para ficar mais próxima da linguagem visual do PJ Lite: painéis simples, temas por sistema e menos efeitos de interface.
- Arraste e redimensionamento das janelas estabilizados com encerramento global de ponteiro, cancelamento, perda de foco e recuperação quando o botão do mouse já foi solto.
- Mobile próprio do DM Lite: janelas em pilha, foco individual e reordenação sem tentar simular o desktop.
- Escudos prontos resumidos a partir dos materiais de referência do usuário para Dragonbane, Fabula Ultima, D&D 5.5e, Tormenta20, Ordem Paranormal, 3DeT Victory e 3D&T Alpha.
- Importação de fichas do PJ Lite atual por Código da Ficha, ZIP ou JSON.
- Importação/exportação de escudos por JSON e códigos `DMLITE3:`, com leitura das versões anteriores.
- Migração automática dos saves locais da linha 0.3 (`dmlite_shields_v1`) para a estrutura atual.

## Desenvolvimento

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

Os saves ficam no navegador. Faça backups periódicos dos escudos importantes usando a opção de exportação.
