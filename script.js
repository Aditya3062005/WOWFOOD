// --- DATA ---
const menuItems = [
    { id: 1, name: "Volcano Burger", category: "Burgers", price: 12.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", desc: "Triple beef with habanero sauce." },
    { id: 2, name: "Garden Fresh", category: "Burgers", price: 10.50, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", desc: "100% plant-based patty." },
    { id: 3, name: "Cheesy Pepperoni", category: "Pizza", price: 15.00, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", desc: "Double cheese and spicy pepperoni." },
    { id: 4, name: "Truffle Fries", category: "Sides", price: 5.99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", desc: "Hand-cut fries with truffle oil." },
    { id: 5, name: "BBQ Chicken Pizza", category: "Pizza", price: 14.50, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", desc: "Smoky BBQ sauce and chicken." },
    { id: 6, name: "Spicy Wings", category: "Sides", price: 8.99, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500", desc: "Crispy wings with peri-peri rub." }
];

let cart = [];
let currentUser = null;
let orderHistory = [];
let isLoginMode = true;

// --- INIT ---
window.onload = () => {
    renderMenu(menuItems);
    setupFilters();
    setupSearch();
};

// --- AUTH LOGIC ---
function openAuthModal() { document.getElementById('auth-modal').classList.add('flex'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.remove('flex'); }

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Welcome Back" : "Join WOWFOOD";
    document.getElementById('signup-fields').classList.toggle('hidden', isLoginMode);
    document.getElementById('auth-submit-btn').innerText = isLoginMode ? "Log In" : "Create Account";
}

document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('auth-name').value || "Valued Guest";
    const email = document.getElementById('auth-email').value;

    currentUser = { name, email };
    
    // UI Update
    document.getElementById('nav-auth-btn').classList.add('hidden');
    document.getElementById('nav-profile-btn').classList.remove('hidden');
    document.getElementById('profile-name').innerText = currentUser.name;
    document.getElementById('profile-email').innerText = currentUser.email;
    document.getElementById('profile-initials').innerText = currentUser.name.charAt(0).toUpperCase();

    closeAuthModal();
});

function logout() { location.reload(); }

// --- DRAWER TOGGLES ---
function toggleCart() { document.getElementById('cart-drawer').classList.toggle('translate-x-full'); }
function toggleProfile() { document.getElementById('profile-drawer').classList.toggle('-translate-x-full'); }

// --- CART LOGIC ---
function addToCart(id) {
    const item = menuItems.find(m => m.id === id);
    cart.push(item);
    updateCartUI();
    const badge = document.getElementById('cart-count');
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 300);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-slate-400 text-center py-10">Cart is empty.</p>';
        totalEl.innerText = '$0.00';
        return;
    }

    container.innerHTML = cart.map((item, i) => `
        <div class="flex justify-between items-center mb-4 pb-4 border-b">
            <div class="flex items-center space-x-3">
                <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover">
                <div><p class="font-bold text-sm">${item.name}</p><p class="text-xs text-slate-400">$${item.price}</p></div>
            </div>
            <button onclick="removeFromCart(${i})" class="text-red-500"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + i.price, 0);
    totalEl.innerText = `$${total.toFixed(2)}`;
}

// --- CHECKOUT & ORDER HISTORY ---
function handleCheckout() {
    if (!currentUser) {
        alert("Please Log In to place an order.");
        openAuthModal();
        return;
    }
    if (cart.length === 0) return alert("Your cart is empty!");

    const order = {
        id: Math.floor(Math.random() * 10000),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cart.reduce((s, i) => s + i.price, 0).toFixed(2)
    };

    orderHistory.unshift(order);
    renderOrderHistory();
    
    // Reset Cart
    cart = [];
    updateCartUI();
    toggleCart();
    alert("Order Successful! View it in My Profile.");
}

function renderOrderHistory() {
    const container = document.getElementById('order-history');
    if (orderHistory.length === 0) {
        container.innerHTML = '<p class="text-slate-400 text-center py-10 italic">No orders yet.</p>';
        return;
    }

    container.innerHTML = orderHistory.map(order => `
        <div class="order-pill p-4 rounded-r-xl shadow-sm border border-slate-100">
            <div class="flex justify-between mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase">${order.date}</span>
                <span class="font-bold text-red-700">$${order.total}</span>
            </div>
            <div class="space-y-1">
                ${order.items.map(item => `<div class="flex justify-between text-xs text-slate-600"><span>1x ${item.name}</span><span>$${item.price}</span></div>`).join('')}
            </div>
        </div>
    `).join('');
}

// --- MENU RENDERING ---
function renderMenu(items) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = items.map(item => `
        <div class="food-card bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100">
            <img src="${item.image}" class="w-full h-56 object-cover">
            <div class="p-6">
                <div class="flex justify-between mb-2"><span class="text-xs font-bold text-red-600 uppercase">${item.category}</span><span class="font-bold">$${item.price}</span></div>
                <h3 class="text-xl font-bold mb-2">${item.name}</h3>
                <p class="text-slate-500 text-sm mb-6">${item.desc}</p>
                <button onclick="addToCart(${item.id})" class="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">Add to Order</button>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            const cat = btn.dataset.category;
            renderMenu(cat === 'all' ? menuItems : menuItems.filter(i => i.category === cat));
        };
    });
}

function setupSearch() {
    document.getElementById('food-search').oninput = (e) => {
        const val = e.target.value.toLowerCase();
        renderMenu(menuItems.filter(i => i.name.toLowerCase().includes(val)));
    };
}

// --- CONTACT FORM HANDLING ---
(function setupContactForm(){
    const contactForm = document.getElementById('orderForm');
    if (!contactForm) return;

    // Create message container
    const msgEl = document.createElement('div');
    msgEl.className = 'form-message';
    contactForm.insertBefore(msgEl, contactForm.firstChild);

    const submitBtn = contactForm.querySelector('button[type="submit"]');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(type, text) {
        msgEl.className = 'form-message ' + type;
        msgEl.innerText = text;
        // Auto-dismiss errors after 4s
        if (type === 'error') setTimeout(() => msgEl.className = 'form-message', 4000);
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const first = contactForm.querySelector('input[placeholder="First Name"]').value.trim();
        const last = contactForm.querySelector('input[placeholder="Last Name"]').value.trim();
        const email = contactForm.querySelector('input[type="email"]').value.trim();
        const message = contactForm.querySelector('textarea').value.trim();

        if (!first || !last || !validateEmail(email) || !message) {
            showMessage('error', 'Please complete all fields with a valid email.');
            return;
        }

        // Disable form and show spinner
        const controls = contactForm.querySelectorAll('input, textarea, button');
        controls.forEach(c => c.disabled = true);
        const originalBtn = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"><span class="spinner"></span> Sending...</span>';

        // Mock network request
        setTimeout(() => {
            // Save message locally (mock persistence)
            const stored = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            stored.unshift({ first, last, email, message, date: new Date().toISOString() });
            localStorage.setItem('contactMessages', JSON.stringify(stored));

            showMessage('success', 'Message sent! We will get back to you within 24 hours.');
            contactForm.reset();
            submitBtn.innerHTML = originalBtn;
            controls.forEach(c => c.disabled = false);
        }, 1200);
    });
})();

// --- REVEAL ON SCROLL ---
(function setupRevealObserver(){
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.12 });

    items.forEach(i => obs.observe(i));
})();
