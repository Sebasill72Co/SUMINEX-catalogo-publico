import fs from 'node:fs';
import vm from 'node:vm';

const context = {
  localStorage: { getItem: () => '[]', setItem: () => {} },
  cartCount: { textContent: '' }, topCount: { textContent: '' },
  cartList: { innerHTML: '' }, summary: { innerHTML: '' },
  openCart: () => {}, money: n => `$${n}`
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/js/products.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('assets/js/cart.js', 'utf8'), context);

const cases = [
  ['1 unidad', [1], false],
  ['11 unidades', [11], false],
  ['12 unidades', [12], true],
  ['13 unidades', [13], true],
  ['mixto 6 + 6', [6, 6], true],
  ['mixto 4 + 4 + 4', [4, 4, 4], true]
];
const results = cases.map(([name, quantities, expected]) => {
  const lines = quantities.map((qty, i) => ({id: `bd-00${i + 1}`, color: 'negro', qty}));
  context.__lines = lines;
  const result = vm.runInContext('cart=__lines; totals()', context);
  if (result.wholesale !== expected) throw new Error(`${name}: resultado incorrecto`);
  return {prueba:name,unidades:result.units,mayorista:result.wholesale,precio:result.unitPrice,total:result.total};
});
context.__lines = [{id:'bd-001',color:'negro',qty:12}];
const message = vm.runInContext('cart=__lines; orderText()', context);
if (!message.includes('Precio mayorista') || !message.includes('$16000')) throw new Error('Mensaje de WhatsApp incorrecto');
console.log(JSON.stringify({ok:true,umbral:12,resultados:results,mensajeWhatsApp:'APROBADO'},null,2));
