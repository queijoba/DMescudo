class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
  clear() { this.map.clear(); }
}

globalThis.localStorage = new MemoryStorage();

const storage = await import(`../src/storage.js?verify=${Date.now()}`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Migração de um save realista da linha 0.3.x.
localStorage.setItem('dmlite_shields_v1', JSON.stringify([{
  id: 123,
  name: 'Mesa Antiga',
  genre: 'Fantasia',
  system: 'dragonbane',
  widgets: [
    { id: 1, type: 'note', title: 'Notas', pages: [{ id: 7, title: 'Sessão', content: '<b>Teste</b>' }], activePageId: 7 },
    { id: 2, type: 'initiative', title: 'Iniciativa', combatants: [{ id: 9, name: 'Herói', init: 18 }], activeId: 9 },
  ],
  settings: { theme: 'blue', fontSize: 18, bgType: 'image', bgValue: 'https://example.com/bg.jpg', opacity: 45 },
}]));
localStorage.setItem('dmlite_current_shield_v1', JSON.stringify(123));

let shields = storage.loadShields();
assert(shields.length === 1, 'deveria migrar um escudo legado');
assert(shields[0].id === '123', 'ID legado deve virar string sem mudar o valor');
assert(shields[0].settings.theme === '3det', 'tema blue legado deve ser convertido');
assert(Math.abs(shields[0].settings.fontScale - 1.125) < 0.001, 'fontSize legado deve virar fontScale');
assert(shields[0].settings.background === 'https://example.com/bg.jpg', 'fundo legado deve ser preservado');
assert(Math.abs(shields[0].settings.backgroundOpacity - 0.45) < 0.001, 'opacidade legado deve ser preservada');
assert(shields[0].widgets[0].activePageId === '7', 'página ativa deve continuar válida');
assert(shields[0].widgets[1].activeId === '9', 'combatente ativo deve continuar válido');
assert(storage.loadLastId() === '123', 'escudo atual legado deve ser restaurado');
assert(localStorage.getItem('dmlite_shields_v1'), 'o backup legado não deve ser apagado');

// Recuperação das chaves soltas usadas pelas versões 0.3.x.
localStorage.clear();
localStorage.setItem('dmlite_v030_layout', JSON.stringify([{ id: 22, type: 'dice', title: 'Dados', history: ['1d20 → 15'] }]));
localStorage.setItem('dmlite_v030_settings', JSON.stringify({ theme: 'dragonbane', fontSize: 16, opacity: 30 }));
shields = storage.loadShields();
assert(shields.length === 1, 'layout solto deve gerar uma Mesa Recuperada');
assert(shields[0].name.includes('Recuperada'), 'mesa recuperada deve ser identificável');
assert(shields[0].widgets[0].type === 'dice', 'widget antigo deve sobreviver à recuperação');
assert(storage.loadLastId() === shields[0].id, 'mesa recuperada deve virar a mesa atual');

console.log('Migração DM Lite: 0.3.x → schema 4 verificada com preservação de saves, preferências e mesa atual.');
