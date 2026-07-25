const CONFIG = Object.freeze({ precioDetal: 20000, precioMayorista: 16000, minimoMayorista: 30 });
const COLORS = [
  ['amarillo-pastel','Amarillo pastel'], ['cafe','Café'], ['azul-cielo','Azul cielo'],
  ['rosado-pastel','Rosado pastel'], ['blanco','Blanco'], ['rojo','Rojo'], ['negro','Negro']
];
const product = (id, sku, nombre, extension) => ({
  id, sku, nombre, talla: 'Única',
  variants: Object.fromEntries(COLORS.map(([key, name]) => [key, { name, image: `assets/images/products/${id}/${key}.${extension}` }]))
});
const PRODUCTS = Object.freeze([
  product('bd-001', 'BD-001', 'Body básico manga corta', 'jpg'),
  product('bd-002', 'BD-002', 'Body asimétrico', 'jpg'),
  product('bd-003', 'BD-003', 'Body manga larga', 'png'),
  product('bd-004', 'BD-004', 'Body escote amplio manga corta', 'png')
]);
const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map(item => [item.id, item]));
