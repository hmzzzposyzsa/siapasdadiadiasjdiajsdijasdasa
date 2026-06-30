// Mengatur Lucide Icons
lucide.createIcons();

// State Toko
const state = {
    currentPage: 'home',
    searchQuery: '',
    selectedCategory: 'semua',
    currentProduct: null,
    selectedPayment: '',
    buyerContact: '',
    buyerNotes: ''
};

// URL API External - Ganti link ini dengan endpoint API mu jika ingin ambil data luar
const EXTERNAL_API_URL = ""; 

let STORE_DATA = {
    user: {
        username: "RianModss",
        role: "Premium Owner",
        balance: "Rp 250.000",
        avatarLetter: "R"
    },
    infoLinks: [
        {
            title: "Grup Komunitas WhatsApp",
            subtitle: "Tempat diskusi dan update stock terbaru",
            url: "https://chat.whatsapp.com/example",
            icon: "message-square"
        },
        {
            title: "Hubungi Admin via WhatsApp",
            subtitle: "Layanan bantuan 24/7 jika ada kendala",
            url: "https://wa.me/628xxxxxxxxxx",
            icon: "phone"
        }
    ],
    products: [
        {
            id: "p1",
            category: "Roblox",
            name: "Script Kaitun Auto-Farm (Fish It) v2.5",
            price: "Rp 35.000",
            originalPrice: "Rp 50.000",
            rating: "4.9",
            sold: "142",
            badge: "Hot",
            badgeClass: "badge-red",
            image: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=500"
        },
        {
            id: "p2",
            category: "Web App",
            name: "Source Code WhatsApp Gateway API (Mirip Fonnte)",
            price: "Rp 120.000",
            originalPrice: "Rp 250.000",
            rating: "5.0",
            sold: "38",
            badge: "Best Seller",
            badgeClass: "badge-violet",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500"
        }
    ]
};

// Ambil data jika EXTERNAL_API_URL diisi
async function fetchStoreData() {
    if (!EXTERNAL_API_URL) {
        initApp();
        return;
    }
    try {
        const res = await fetch(EXTERNAL_API_URL);
        if (res.ok) {
            const data = await res.json();
            if (data) {
                STORE_DATA = data;
            }
        }
    } catch (e) {
        console.error("Gagal memuat API backend, memakai data lokal lokal:", e);
    }
    initApp();
}

function initApp() {
    updateUserData();
    renderInfoLinks();
    renderHomeProducts();
    renderAllProducts();
    setupEventListeners();
    routeTo(state.currentPage);
}

function updateUserData() {
    document.querySelectorAll('.user-name-text').forEach(el => el.textContent = STORE_DATA.user.username);
    document.querySelectorAll('.user-role-text').forEach(el => el.textContent = STORE_DATA.user.role);
    document.querySelectorAll('.user-balance-text').forEach(el => el.textContent = STORE_DATA.user.balance);
    document.querySelectorAll('.user-avatar-text').forEach(el => el.textContent = STORE_DATA.user.avatarLetter);
}

function renderInfoLinks() {
    const container = document.getElementById('infoLinksContainer');
    if (!container) return;
    container.innerHTML = STORE_DATA.infoLinks.map(link => `
        <a href="${link.url}" target="_blank" class="info-drop-link">
            <div class="info-drop-link-left">
                <div class="info-drop-icon">${getIconSvg(link.icon)}</div>
                <div>${link.title}<div class="info-acc-sub">${link.subtitle}</div></div>
            </div>
            <i data-lucide="arrow-up-right" class="info-drop-arrow"></i>
        </a>
    `).join('');
    lucide.createIcons({ attrs: { class: ['info-drop-arrow'] } });
}

function renderHomeProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if (!grid) return;
    const featured = STORE_DATA.products.slice(0, 3);
    grid.innerHTML = featured.map(p => createProductCardHtml(p)).join('');
}

function renderAllProducts() {
    const grid = document.getElementById('allProductsGrid');
    if (!grid) return;
    
    const filtered = STORE_DATA.products.filter(p => {
        const matchesCat = state.selectedCategory === 'semua' || p.category.toLowerCase() === state.selectedCategory.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || p.category.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i data-lucide="search-slash"></i>
                <p>Produk tidak ditemukan</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    grid.innerHTML = filtered.map(p => createProductCardHtml(p)).join('');
}

function createProductCardHtml(p) {
    return `
        <button class="product-card" onclick="viewProductDetail('${p.id}')">
            <div class="product-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy" />
                <div class="product-img-overlay"></div>
                ${p.badge ? `<span class="product-badge ${p.badgeClass || 'badge-yellow'}">${p.badge}</span>` : ''}
            </div>
            <div class="product-body">
                <span class="product-cat">${p.category}</span>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">
                    ${getStarSvg()} <strong>${p.rating}</strong> <span>(${p.sold} Terjual)</span>
                </div>
                <div class="product-footer">
                    <div>
                        <span class="product-price">${p.price}</span>
                        ${p.originalPrice ? `<span class="product-original">${p.originalPrice}</span>` : ''}
                    </div>
                    <span class="buy-btn">Beli</span>
                </div>
            </div>
        </button>
    `;
}

function viewProductDetail(id) {
    const p = STORE_DATA.products.find(prod => prod.id === id);
    if (!p) return;
    state.currentProduct = p;
    
    document.getElementById('detailCat').textContent = p.category;
    document.getElementById('detailName').textContent = p.name;
    document.getElementById('detailImg').src = p.image;
    document.getElementById('detailPrice').textContent = p.price;
    document.getElementById('detailPriceOrig').textContent = p.originalPrice || '';
    document.getElementById('detailRatingNum').textContent = p.rating;
    document.getElementById('detailSoldNum').textContent = p.sold;
    
    document.getElementById('summaryProdName').textContent = p.name;
    document.getElementById('summaryProdPrice').textContent = p.price;
    document.getElementById('summaryTotalPrice').textContent = p.price;

    state.selectedPayment = '';
    state.buyerContact = '';
    state.buyerNotes = '';
    document.getElementById('buyerContact').value = '';
    document.getElementById('buyerNotes').value = '';
    
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
    
    switchTab('info');
    routeTo('detail');
    window.scrollTo(0,0);
}

function routeTo(pageId) {
    state.currentPage = pageId;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`${pageId}Page`);
    if (target) target.active = true, target.classList.add('active');

    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(pageId)) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if(menu) menu.classList.toggle('hidden');
}

function toggleInfoAccordion() {
    const acc = document.getElementById('infoAccordion');
    if(acc) acc.classList.toggle('open');
}

function toggleFaq(btn) {
    btn.classList.toggle('open');
    const ans = btn.nextElementSibling;
    if(ans) ans.classList.toggle('hidden');
}

function toggleAccordionBtn(btn) {
    btn.classList.toggle('open');
    const content = btn.nextElementSibling;
    if(content) content.classList.toggle('hidden');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => {
        if(b.getAttribute('onclick').includes(tabId)) b.classList.add('active');
        else b.classList.remove('active');
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(`${tabId}Tab`);
    if(activePanel) activePanel.classList.add('active');
}

function setCategory(cat) {
    state.selectedCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => {
        if(b.getAttribute('onclick').includes(cat)) b.classList.add('active');
        else b.classList.remove('active');
    });
    renderAllProducts();
}

function selectPayment(btn, method) {
    state.selectedPayment = method;
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function submitOrder() {
    state.buyerContact = document.getElementById('buyerContact').value.trim();
    state.buyerNotes = document.getElementById('buyerNotes').value.trim();

    if (!state.buyerContact) {
        alert('Mohon isi nomor WhatsApp Anda!');
        return;
    }
    if (!state.selectedPayment) {
        alert('Mohon pilih metode pembayaran!');
        return;
    }

    const payTab = document.getElementById('paymentTab');
    if (payTab) {
        payTab.innerHTML = `
            <div class="success-wrap">
                <div class="success-icon">${getIconSvg('check')}</div>
                <h3>Pesanan Berhasil!</h3>
                <p>Sistem sedang mengalihkan Anda ke WhatsApp Admin...</p>
            </div>
        `;
    }

    setTimeout(() => {
        const text = `Halo Admin, saya ingin membeli:\n\n` +
                     `📦 *Produk:* ${state.currentProduct.name}\n` +
                     `💰 *Harga:* ${state.currentProduct.price}\n` +
                     `💳 *Metode:* ${state.selectedPayment.toUpperCase()}\n` +
                     `📱 *No. WA:* ${state.buyerContact}\n` +
                     `📝 *Catatan:* ${state.buyerNotes || '-'}\n\n` +
                     `Mohon segera diproses ya, terima kasih!`;
        
        const waUrl = `https://wa.me/628xxxxxxxxxx?text=${encodeURIComponent(text)}`;
        window.location.href = waUrl;
    }, 2000);
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderAllProducts();
        });
    }
}

function getIconSvg(name) {
    if (name === 'message-square') return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    if (name === 'phone') return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    if (name === 'check') return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    return '';
}

function getStarSvg() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#EAB308" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
}

// Jalankan Load Data Utama
window.addEventListener('DOMContentLoaded', fetchStoreData);

// GANTI LOGO — isi URL gambar di sini
const LOGO_URL = "https://cdn.discordapp.com/attachments/1456563448090722432/1521166822110400652/IMG_20260628_223023_644.webp?ex";
