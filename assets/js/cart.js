const CART_KEY = 'suminexCartV8';
let cart = loadCart();

function loadCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(value) ? value.filter(item => PRODUCT_BY_ID[item.id]?.variants[item.color] && item.qty > 0) : [];
  } catch { return []; }
}
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); }
function addProduct(id, color, qty) {
  const existing = cart.find(item => item.id === id && item.color === color);
  if (existing) existing.qty += qty; else cart.push({ id, color, qty });
  saveCart(); openCart();
}
function removeItem(index) { cart.splice(index, 1); saveCart(); }
function clearCart() { cart = []; saveCart(); }
function totals() {
  const units = cart.reduce((sum, item) => sum + item.qty, 0);
  const wholesale = units >= CONFIG.minimoMayorista;
  const unitPrice = wholesale ? CONFIG.precioMayorista : CONFIG.precioDetal;
  return { units, wholesale, unitPrice, total: units * unitPrice, missing: Math.max(0, CONFIG.minimoMayorista - units) };
}
function renderCart() {
  const values = totals();
  cartCount.textContent = values.units; topCount.textContent = values.units;
  cartList.innerHTML = cart.length ? cart.map((item, index) => {
    const p = PRODUCT_BY_ID[item.id], v = p.variants[item.color];
    return `<div class="cart-item"><img src="${v.image}" alt="${p.nombre} ${v.name}"><div><b>${p.sku} · ${p.nombre}</b><small>Color: ${v.name}</small><small>${item.qty} × ${money(values.unitPrice)} = <strong>${money(item.qty * values.unitPrice)}</strong></small></div><button class="remove" type="button" data-remove="${index}" aria-label="Eliminar línea">×</button></div>`;
  }).join('') : '<p class="empty">Todavía no has agregado productos.</p>';
  const missingLabel = values.missing === 1 ? 'Falta 1 unidad' : `Faltan ${values.missing} unidades`;
  summary.innerHTML = `<div class="sum-row"><span>Total de unidades</span><b>${values.units}</b></div><div class="sum-row"><span>Precio por unidad</span><b>${money(values.unitPrice)}</b></div><div class="sum-row total"><span>Total general</span><span>${money(values.total)}</span></div><div class="status ${values.wholesale ? 'ok' : ''}">${values.wholesale ? '¡Ya tienes precio mayorista activo!' : `${missingLabel} para activar el precio mayorista.`}</div>`;
}
function orderText() {
  const values = totals();
  const lines = cart.map(item => { const p = PRODUCT_BY_ID[item.id], v = p.variants[item.color]; return `• ${p.sku} | ${p.nombre} | ${v.name} | ${item.qty} unidades`; });
  return ['PEDIDO SUMINEX IMPORTACIONES', '', ...lines, '', `Total de unidades: ${values.units}`, `Precio aplicado: ${money(values.unitPrice)} por unidad`, `Total: ${money(values.total)}`, `Condición: ${values.wholesale ? 'Precio mayorista' : 'Precio unitario'}`].join('\n');
}
