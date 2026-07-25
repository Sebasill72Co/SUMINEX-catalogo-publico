import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const products = fs.readFileSync(path.join(root, 'assets/js/products.js'), 'utf8');
const referenced = [...html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)].map(x => x[1]);
const missing = referenced.filter(x => !/^https?:/.test(x) && !fs.existsSync(path.join(root, x)));

const productRoot = path.join(root, 'assets/images/products');
const images = fs.readdirSync(productRoot).flatMap(ref =>
  fs.readdirSync(path.join(productRoot, ref)).map(file => path.join('assets/images/products', ref, file))
).sort();
const logos = fs.readdirSync(path.join(root, 'assets/images/brand')).filter(x => /\.(png|jpe?g|webp)$/i.test(x));

if (missing.length) throw new Error(`Recursos rotos: ${missing.join(', ')}`);
if (images.length !== 28) throw new Error(`Se esperaban 28 fotografías; encontradas: ${images.length}`);
if (logos.length !== 2) throw new Error(`Se esperaban 2 logos; encontrados: ${logos.length}`);
for (const file of images) {
  const full = path.join(root, file);
  if (fs.statSync(full).size < 1024) throw new Error(`Imagen vacía o sospechosa: ${file}`);
}
for (const id of ['bd-001', 'bd-002', 'bd-003', 'bd-004']) {
  const count = images.filter(x => x.includes(`/${id}/`)).length;
  if (count !== 7 || !products.includes(`'${id}'`)) throw new Error(`${id}: se esperaban 7 imágenes y una definición de producto`);
}
if (/\/Users\/|file:\/\/|localhost|127\.0\.0\.1/.test(html + products)) throw new Error('Se detectó una ruta exclusiva del equipo local.');
for (const required of ['minimoMayorista: 12', 'precioDetal: 20000', 'precioMayorista: 16000']) {
  if (!products.includes(required)) throw new Error(`Falta regla comercial: ${required}`);
}
console.log(JSON.stringify({ok:true,productos:4,fotografias:images.length,logos:logos.length,recursosHtml:referenced.length,rutasRotas:0}));
