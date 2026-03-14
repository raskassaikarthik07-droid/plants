// ===== PRODUCT DATA =====
const products = [
  // Indoor Plants
  { id: 1,  name: "Money Plant",      category: "indoor",    img: "images/plant_money_plant.png",    price: 149, oldPrice: 199, badge: "sale", desc: "Easy-care, brings good luck & purifies air." },
  { id: 2,  name: "Peace Lily",       category: "indoor",    img: "images/plant_peace_lily.png",     price: 299, oldPrice: null, badge: "new", desc: "Beautiful white blooms, thrives in low light." },
  { id: 3,  name: "Snake Plant",      category: "indoor",    img: "images/plant_snake_plant.png",    price: 249, oldPrice: null, badge: null,  desc: "NASA-approved air purifier, very low maintenance." },
  { id: 4,  name: "Aloe Vera",        category: "indoor",    img: "images/plant_aloe_vera.png",      price: 179, oldPrice: 220, badge: "sale", desc: "Medicinal plant, great for skin & sunburns." },
  { id: 5,  name: "Jade Plant",       category: "indoor",    img: "images/plant_jade_plant.png",     price: 199, oldPrice: null, badge: null,  desc: "Succulent shrub, symbolizes wealth & success." },
  // Outdoor Plants
  { id: 6,  name: "Rose Bush",        category: "outdoor",   img: "images/plant_rose_bush.png",      price: 349, oldPrice: 450, badge: "sale", desc: "Classic red rose. Blooms in spring & summer." },
  { id: 7,  name: "Sunflower",        category: "outdoor",   img: "images/plant_sunflower.png",      price: 99,  oldPrice: null, badge: "new", desc: "Bright & cheerful, loves full sun." },
  { id: 8,  name: "Marigold",         category: "outdoor",   img: "images/plant_marigold.png",       price: 79,  oldPrice: null, badge: null,  desc: "Pest-repellent & colorful garden border plant." },
  { id: 9,  name: "Tulip Bulbs",      category: "outdoor",   img: "images/plant_tulip.png",          price: 199, oldPrice: null, badge: null,  desc: "Set of 5 bulbs. Spring blooming beauty." },
  // Succulents
  { id: 10, name: "Echeveria",        category: "succulent", img: "images/plant_echeveria.png",      price: 129, oldPrice: null, badge: "new", desc: "Rosette-shaped succulent, minimal water needed." },
  { id: 11, name: "Cactus Mini",      category: "succulent", img: "images/plant_cactus_mini.png",    price: 89,  oldPrice: null, badge: null,  desc: "Perfect desk plant, almost zero care needed." },
  { id: 12, name: "Haworthia",        category: "succulent", img: "images/plant_haworthia.png",      price: 149, oldPrice: 180, badge: "sale", desc: "Striped, compact succulent for bright spots." },
  // Pots & Planters
  { id: 13, name: "Terracotta Pot",   category: "pots",      img: "images/pot_terracotta.png",       price: 129, oldPrice: null, badge: null,  desc: "Classic 6-inch pot with drainage hole." },
  { id: 14, name: "Ceramic White Pot",category: "pots",      img: "images/pot_ceramic_white.png",    price: 249, oldPrice: 299, badge: "sale", desc: "Minimalist matte white, 8-inch diameter." },
  { id: 15, name: "Hanging Planter",  category: "pots",      img: "images/pot_hanging_planter.png",  price: 199, oldPrice: null, badge: "new", desc: "Macrame rope hanger with ceramic pot." },
  { id: 16, name: "Self-Watering Pot",category: "pots",      img: "images/pot_self_watering.png",    price: 349, oldPrice: 420, badge: "sale", desc: "Built-in water reservoir, keeps soil moist." },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem("plantCart")) || [];
let activeCategory = "all";

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem("plantCart", JSON.stringify(cart));
}

// ===== RENDER PRODUCTS =====
function renderProducts(filter = "all", searchQuery = "") {
  const grid = document.getElementById("productsGrid");
  let filtered = products;

  if (filter !== "all") {
    filtered = filtered.filter(p => p.category === filter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-light);">
      <div style="font-size:3rem;margin-bottom:14px;">🔍</div>
      <p style="font-size:1.1rem;">No plants found. Try a different search!</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const cartItem = cart.find(c => c.id === p.id);
    const isInCart = !!cartItem;
    return `
    <div class="product-card" data-id="${p.id}">
      ${p.badge ? `<div class="product-badge ${p.badge}">${p.badge === 'new' ? '🆕 New' : p.badge === 'sale' ? '🔥 Sale' : ''}</div>` : ''}
      <div class="product-img-wrap"><img src="${p.img}" alt="${p.name}" /></div>
      <div class="product-info">
        <div class="product-category">${getCatLabel(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="price">
            ₹${p.price}
            ${p.oldPrice ? `<span class="old-price">₹${p.oldPrice}</span>` : ''}
          </div>
          <button class="add-cart-btn ${isInCart ? 'added' : ''}" onclick="addToCart(${p.id})" id="btn-${p.id}">
            ${isInCart ? '✅ Added' : '🛒 Add'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function getCatLabel(cat) {
  const map = { indoor: "🪴 Indoor", outdoor: "🌳 Outdoor", succulent: "🌵 Succulent", pots: "🏺 Pots & Planters" };
  return map[cat] || cat;
}

// ===== CATEGORY FILTER =====
function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.cat-card').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-cat="${cat}"]`)?.classList.add('active');
  renderProducts(cat, document.getElementById('searchInput').value);
}

// ===== ADD TO CART =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`🌿 ${product.name} added to cart!`);

  const btn = document.getElementById(`btn-${id}`);
  if (btn) {
    btn.classList.add('added');
    btn.textContent = '✅ Added';
  }
}

// ===== REMOVE FROM CART =====
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
  renderCartItems();
  renderProducts(activeCategory, document.getElementById('searchInput').value);
}

// ===== CHANGE QTY =====
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  updateCartUI();
  renderCartItems();
}

// ===== UPDATE CART COUNT & TOTAL =====
function updateCartUI() {
  const totalQty = cart.reduce((acc, c) => acc + c.qty, 0);
  document.getElementById('cartCount').textContent = totalQty;
  const total = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  document.getElementById('cartTotal').textContent = `₹${total}`;
}

// ===== RENDER CART ITEMS =====
function renderCartItems() {
  const container = document.getElementById('cartItems');

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty">
      <div class="empty-icon">🛒</div>
      <p>Your cart is empty.<br>Add some green friends!</p>
    </div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji"><img src="${item.img}" alt="${item.name}" /></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} each</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== CART SIDEBAR =====
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

// ===== CHECKOUT =====
function checkout() {
  if (cart.length === 0) {
    showToast("🛒 Your cart is empty!");
    return;
  }
  const total = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  alert(`🌿 Thank you for shopping at GreenLeaf!\n\nOrder Summary:\n${cart.map(c => `  ${c.emoji} ${c.name} x${c.qty} = ₹${c.price * c.qty}`).join('\n')}\n\nTotal: ₹${total}\n\n✅ Your order has been placed! (Demo)`);
  cart = [];
  saveCart();
  updateCartUI();
  renderCartItems();
  renderProducts(activeCategory, document.getElementById('searchInput').value);
  closeCart();
}

// ===== TOAST =====
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== SEARCH =====
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderProducts();
  updateCartUI();

  // Search
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    renderProducts(activeCategory, searchInput.value);
  });

  // Scroll-to-products on hero button
  document.getElementById('shopNowBtn')?.addEventListener('click', () => {
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
  });
});
