const selected = Object.fromEntries(PRODUCTS.map(item => [item.id, 'cafe']));
const money = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
const $ = id => document.getElementById(id);
const { productGrid, drawer, backdrop, lightbox, lightboxImage, toast } = Object.fromEntries(['productGrid','drawer','backdrop','lightbox','lightboxImage','toast'].map(id => [id, $(id)]));

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map(p => { const current = p.variants[selected[p.id]]; return `<article class="product" data-product="${p.id}"><div class="main-media"><img id="main-${p.id}" src="${current.image}" alt="${p.nombre} en color ${current.name}"><span class="sku">${p.sku}</span><button class="zoom" type="button" data-zoom="${p.id}" aria-label="Ampliar fotografía">+</button></div><div class="gallery">${Object.entries(p.variants).map(([key,v]) => `<button class="thumb ${key === selected[p.id] ? 'active' : ''}" type="button" data-product-id="${p.id}" data-color="${key}"><img src="${v.image}" alt="${p.nombre} ${v.name}"><span>${v.name}</span></button>`).join('')}</div><div class="product-body"><p class="gallery-help">Selecciona un color para ver el mockup correspondiente.</p><div class="product-title"><h3>${p.nombre}</h3><span class="badge">Talla única</span></div><p class="current"><span class="swatch swatch-${selected[p.id]}" id="swatch-${p.id}"></span>Color elegido: <strong id="label-${p.id}">${current.name}</strong></p><div class="prices"><div class="price"><small>Precio unitario</small><b>$20.000</b></div><div class="price dark"><small>Precio mayorista</small><b>$16.000</b></div></div><label class="qty-label" for="qty-${p.id}">¿Cuántas unidades deseas de este color?</label><div class="order-row"><div class="qty-stepper"><button type="button" data-qty="minus" data-qty-product="${p.id}" aria-label="Restar una unidad">−</button><input class="qty" id="qty-${p.id}" type="number" min="1" value="1" inputmode="numeric" aria-label="Cantidad"><button type="button" data-qty="plus" data-qty-product="${p.id}" aria-label="Sumar una unidad">+</button></div><button class="order-btn" type="button" data-add="${p.id}">Agregar al pedido</button></div><p class="note">Puedes añadir más colores y referencias después.</p></div></article>`; }).join('');
}
function selectColor(id, color) {
  selected[id] = color; const p = PRODUCT_BY_ID[id], v = p.variants[color], card = document.querySelector(`[data-product="${id}"]`);
  const image = $(`main-${id}`); image.src = v.image; image.alt = `${p.nombre} en color ${v.name}`; $(`label-${id}`).textContent = v.name;
  $(`swatch-${id}`).className = `swatch swatch-${color}`;
  card.querySelectorAll('.thumb').forEach(button => button.classList.toggle('active', button.dataset.color === color));
}
function openCart() { drawer.classList.add('open'); backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { drawer.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; }
function closeLightbox() { lightbox.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; }
let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); }
async function sendWhatsApp() {
  if (!cart.length) { showToast('Agrega al menos un producto antes de finalizar.'); return; }
  const message = orderText();
  if (WHATSAPP_NUMBER) { window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener'); return; }
  try { await navigator.clipboard.writeText(message); } catch { const area = document.createElement('textarea'); area.value = message; document.body.append(area); area.select(); document.execCommand('copy'); area.remove(); }
  showToast('Pedido copiado. Solo falta definir el número de WhatsApp.');
}

document.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.productId) selectColor(button.dataset.productId, button.dataset.color);
  if (button.dataset.qtyProduct) { const input = $(`qty-${button.dataset.qtyProduct}`), delta = button.dataset.qty === 'plus' ? 1 : -1; input.value = Math.max(1, (Number(input.value) || 1) + delta); }
  if (button.dataset.add) { const qty = Math.max(1, Number($(`qty-${button.dataset.add}`).value) || 1), p = PRODUCT_BY_ID[button.dataset.add], v = p.variants[selected[p.id]]; addProduct(p.id, selected[p.id], qty); showToast(`${qty} ${qty === 1 ? 'unidad añadida' : 'unidades añadidas'}: ${p.sku} · ${v.name}`); }
  if (button.dataset.zoom) { const p = PRODUCT_BY_ID[button.dataset.zoom]; lightboxImage.src = p.variants[selected[p.id]].image; lightbox.classList.add('open'); backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
  if (button.dataset.remove !== undefined) removeItem(Number(button.dataset.remove));
  const actions = { 'open-cart': openCart, 'close-cart': closeCart, 'close-lightbox': closeLightbox, 'send-whatsapp': sendWhatsApp, 'clear-cart': clearCart };
  actions[button.dataset.action]?.();
});
backdrop.addEventListener('click', () => { closeCart(); closeLightbox(); });

const heroItems = PRODUCTS.flatMap(p => Object.entries(p.variants).map(([color, variant]) => ({ p, color, variant })));
let heroIndex = Math.floor(Math.random() * heroItems.length), heroFront = 0;
const heroSlides = [...document.querySelectorAll('.hero-slide')], heroImages = [$('heroA'), $('heroB')];
function showHero(initial = false) {
  const previous = heroItems[heroIndex]; let nextIndex;
  do { nextIndex = Math.floor(Math.random() * heroItems.length); } while (!initial && (nextIndex === heroIndex || heroItems[nextIndex].p.id === previous.p.id && heroItems[nextIndex].color === previous.color));
  heroIndex = nextIndex; const item = heroItems[heroIndex], target = initial ? heroFront : 1 - heroFront;
  heroImages[target].src = item.variant.image; heroImages[target].alt = `${item.p.nombre} ${item.variant.name}`;
  if (!initial) { heroSlides[target].classList.add('active'); heroSlides[heroFront].classList.remove('active'); heroFront = target; }
  $('heroTitle').textContent = `${item.p.sku} · ${item.p.nombre}`; $('heroColor').textContent = item.variant.name;
}
renderProducts(); renderCart(); showHero(true); setInterval(() => showHero(false), 6000);
